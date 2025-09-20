import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PatientChatList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Get unique patients from appointments
        const uniquePatients = [];
        const patientIds = new Set();

        data.appointments.forEach(appointment => {
          if (appointment.patientId && !patientIds.has(appointment.patientId._id)) {
            patientIds.add(appointment.patientId._id);
            uniquePatients.push({
              ...appointment.patientId,
              lastAppointment: appointment,
              hasUnreadMessages: Math.random() > 0.7 // Mock unread status
            });
          }
        });

        setPatients(uniquePatients);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    // Mock messages for demonstration
    setMessages([
      {
        id: 1,
        text: `Hello Dr. ${JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Doctor'}! I have some questions about my recent test results.`,
        sender: 'patient',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        text: "Of course! I'd be happy to discuss your test results. What specific questions do you have?",
        sender: 'doctor',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: 3,
        text: "I'm concerned about the cholesterol levels. Are they within normal range?",
        sender: 'patient',
        timestamp: new Date(Date.now() - 900000)
      }
    ]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    setSending(true);
    try {
      // Mock sending message - in real app this would call API
      const messageData = {
        id: Date.now(),
        text: newMessage,
        sender: 'doctor',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, messageData]);
      setNewMessage('');

      // Mock patient response after delay
      setTimeout(() => {
        const responses = [
          "Thank you for your quick response, doctor!",
          "That makes sense. I'll follow your recommendations.",
          "I appreciate your help with this.",
          "When should I schedule my next appointment?",
          "Thank you for explaining that clearly."
        ];

        const mockResponse = {
          id: Date.now() + 1,
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'patient',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, mockResponse]);
      }, 2000);

    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Patient List */}
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Patients</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {patients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">👥</div>
              <p>No patients found</p>
            </div>
          ) : (
            patients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => selectPatient(patient)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedPatient?._id === patient._id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.email}</div>
                    </div>
                  </div>
                  {patient.hasUnreadMessages && (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
                {patient.lastAppointment && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last appointment: {new Date(patient.lastAppointment.scheduledDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2">
        {selectedPatient ? (
          <div className="bg-gray-50 rounded-lg p-4 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">
                    {selectedPatient.name?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{selectedPatient.name}</div>
                  <div className="text-sm text-green-600">Online</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                  📞
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200">
                  📹
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'doctor'
                        ? 'bg-teal-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'doctor' ? 'text-teal-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedPatient.name}...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center h-96 flex items-center justify-center">
            <div>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Patient</h3>
              <p className="text-gray-600">Choose a patient from the list to start a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}