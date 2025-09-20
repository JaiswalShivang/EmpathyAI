import React, { useState, useEffect, useRef } from 'react';
import { onReceiveDirectMessage, sendDirectMessage, startVideoCall, onVideoCallStarted } from '../../utils/socket';
import VideoCall from '../VideoCall';

export default function AppointmentHandling() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallRoomId, setVideoCallRoomId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAppointments();
    fetchCurrentUser();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Listen for real-time messages
  useEffect(() => {
    if (selectedPatient) {
      const cleanup = onReceiveDirectMessage((messageData) => {
        if (messageData.senderId === selectedPatient._id) {
          setChatMessages(prev => [...prev, {
            senderId: messageData.senderId,
            senderRole: messageData.senderRole,
            message: messageData.message,
            createdAt: messageData.timestamp
          }]);
        }
      });
      return cleanup;
    }
  }, [selectedPatient]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError('Error fetching appointments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setAppointments(appointments.map(apt =>
          apt._id === appointmentId ? { ...apt, status } : apt
        ));
      } else {
        console.error('Failed to update appointment status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Open chat modal for a patient
  const openChatModal = async (appointment) => {
    setSelectedPatient(appointment.patientId);
    setShowChatModal(true);

    // Fetch existing messages
    try {
      const response = await fetch(`${API_URL}/api/chat/messages/${appointment.patientId._id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Close chat modal
  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedPatient(null);
    setChatMessages([]);
    setNewMessage('');
  };

  // Send message to patient
  const sendMessageToPatient = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipientId: selectedPatient._id,
          message: newMessage.trim(),
          type: 'TEXT'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, data.message]);
        setNewMessage('');

        // Send via socket for real-time update
        sendDirectMessage({
          recipientId: selectedPatient._id,
          message: data.message.message,
          senderId: data.message.senderId,
          senderRole: 'DOCTOR'
        });
      } else {
        alert('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Error sending message');
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageToPatient();
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Start video call with patient
  const startVideoCallWithPatient = (appointment) => {
    if (!currentUser) return;

    const roomId = `video-${currentUser._id}-${appointment.patientId._id}-${Date.now()}`;

    // Start the video call
    startVideoCall(
      roomId,
      currentUser._id,
      currentUser.name,
      appointment.patientId._id
    );

    setVideoCallRoomId(roomId);
    setShowVideoCall(true);
  };

  // End video call
  const endVideoCall = () => {
    setShowVideoCall(false);
    setVideoCallRoomId('');
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'ALL') return true;
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Appointment Handling</h2>
        <div className="text-center py-4">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Appointment Handling</h2>
        <div className="text-center py-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📅 Appointment Schedule</h2>
        <div className="text-sm text-gray-600">
          {filteredAppointments.length} appointment(s) found
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'ALL', label: 'All', count: appointments.length },
            { value: 'SCHEDULED', label: 'Scheduled', count: appointments.filter(a => a.status === 'SCHEDULED').length },
            { value: 'CONFIRMED', label: 'Confirmed', count: appointments.filter(a => a.status === 'CONFIRMED').length },
            { value: 'COMPLETED', label: 'Completed', count: appointments.filter(a => a.status === 'COMPLETED').length },
            { value: 'CANCELLED', label: 'Cancelled', count: appointments.filter(a => a.status === 'CANCELLED').length }
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === value
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-gray-600">No appointments match the selected filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .map((appointment) => (
            <div key={appointment._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">
                      {appointment.patientId?.name?.charAt(0)?.toUpperCase() || 'P'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.patientId?.name || 'Patient'}</h3>
                    <p className="text-sm text-gray-600">{appointment.patientId?.email || 'No email'}</p>
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                  appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📅</span>
                  <span>{new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">⏰</span>
                  <span>{appointment.scheduledTime} ({appointment.duration} min)</span>
                </div>
                {appointment.notes && (
                  <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                    <span className="font-medium">Notes:</span> {appointment.notes}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Chat Button - Always available */}
                <button
                  onClick={() => openChatModal(appointment)}
                  className="flex-1 px-3 py-2 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  💬 Chat
                </button>

                {/* Video Call Button - Available for confirmed appointments */}
                {appointment.status === 'CONFIRMED' && (
                  <button
                    onClick={() => startVideoCallWithPatient(appointment)}
                    className="flex-1 px-3 py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    📹 Video Call
                  </button>
                )}

                {appointment.status === 'SCHEDULED' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, 'CONFIRMED')}
                    className="flex-1 px-3 py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    ✅ Confirm
                  </button>
                )}
                {appointment.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, 'COMPLETED')}
                    className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    ✓ Complete
                  </button>
                )}
                {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, 'CANCELLED')}
                    className="flex-1 px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    ✕ Cancel
                  </button>
                )}
                {appointment.status === 'COMPLETED' && (
                  <button className="flex-1 px-3 py-2 text-xs bg-gray-500 text-white rounded-lg cursor-not-allowed font-medium">
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">
                    {selectedPatient.name?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                </div>
              </div>
              <button
                onClick={closeChatModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">💬</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h4>
                  <p className="text-gray-600">
                    Send a message to {selectedPatient.name} to begin your consultation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.senderId === selectedPatient._id ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg ${
                          message.senderId === selectedPatient._id
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-teal-600 text-white'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.senderId === selectedPatient._id ? selectedPatient.name : 'You'}
                        </div>
                        <div>{message.message}</div>
                        <div className={`text-xs mt-1 ${
                          message.senderId === selectedPatient._id ? 'text-gray-500' : 'text-teal-100'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedPatient.name}...`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  disabled={sendingMessage}
                />
                <button
                  onClick={sendMessageToPatient}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  💡 Your messages are secure and HIPAA compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && currentUser && (
        <VideoCall
          roomId={videoCallRoomId}
          userId={currentUser._id}
          userName={currentUser.name}
          onEndCall={endVideoCall}
          isDoctor={true}
        />
      )}
    </div>
  );
}