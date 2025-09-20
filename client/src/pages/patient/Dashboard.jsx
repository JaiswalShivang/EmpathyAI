import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MeditationResources from '../../components/MeditationResources';
import AppointmentBooking from '../../components/AppointmentBooking';
import FeedbackForm from '../../components/FeedbackForm';
import { authenticateUser, onDoctorStatusUpdate } from '../../utils/socket';

// General Feedback Form Component
function GeneralFeedbackForm() {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setMessage('Please provide your feedback');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/feedback/general`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          rating: parseInt(rating),
          feedback: feedback.trim()
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Thank you for your feedback! It helps us improve our services.');
        setRating(5);
        setFeedback('');
      } else {
        setMessage(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setMessage('Error submitting feedback: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex items-center mb-6">
        <div className="text-2xl mr-3">💬</div>
        <h2 className="text-xl font-bold text-slate-900">Share Your Feedback</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Thank you')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className={`text-xl mr-3 ${message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
              {message.includes('Thank you') ? '✅' : '❌'}
            </div>
            <div className="font-medium">{message}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            How would you rate your overall experience? 🌟
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Your Feedback 📝
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            rows="5"
            placeholder="Tell us about your experience with EmpathyAI. What did you like? What can we improve? Your feedback helps us serve you better..."
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Your feedback will be displayed on our landing page to help other users
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !feedback.trim()}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 px-6 rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center font-semibold text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Submitting Feedback...
              </>
            ) : (
              <>
                <span className="text-xl mr-3">📤</span>
                Submit Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PatientDashboard(){
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [newAppointmentTime, setNewAppointmentTime] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const chatMessagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Authenticate with Socket.IO for real-time features
          try {
            await authenticateUser(data.user._id, data.user.role);
            console.log('Socket.IO authentication successful');
          } catch (socketError) {
            console.error('Socket.IO authentication failed:', socketError);
          }
        } else if (response.status === 401) {
          // User not authenticated, redirect to login
          console.log('User not authenticated');
          setUser(null);
        } else {
          console.error('Server error:', response.status);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        // If it's a network error or server is down, don't show error to user
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          console.log('Server appears to be down - running in offline mode');
          setUser(null);
        }
      }
    };

    // Set default doctors for appointment booking (without static online status)
    const setDefaultDoctors = () => {
      setDoctors([
        {
          _id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'dr.sarah@empathy.ai',
          role: 'DOCTOR',
          isOnline: false, // Will be updated by Socket.IO
          doctorProfile: {
            specialization: ['Cardiology', 'Internal Medicine'],
            experience: 12,
            qualifications: ['MD - Cardiology', 'MBBS', 'FACC'],
            hospital: 'City General Hospital',
            consultationFee: 1500,
            languages: ['English', 'Hindi'],
            rating: 4.8,
            bio: 'Experienced cardiologist with 12+ years in cardiovascular care.'
          }
        },
        {
          _id: '2',
          name: 'Dr. Michael Chen',
          email: 'dr.michael@empathy.ai',
          role: 'DOCTOR',
          isOnline: false, // Will be updated by Socket.IO
          doctorProfile: {
            specialization: ['Psychiatry', 'Mental Health'],
            experience: 8,
            qualifications: ['MD - Psychiatry', 'MBBS', 'DPM'],
            hospital: 'MindCare Hospital',
            consultationFee: 1200,
            languages: ['English', 'Mandarin'],
            rating: 4.9,
            bio: 'Board-certified psychiatrist specializing in anxiety and depression.'
          }
        },
        {
          _id: '3',
          name: 'Dr. Emily Davis',
          email: 'dr.emily@empathy.ai',
          role: 'DOCTOR',
          isOnline: false, // Will be updated by Socket.IO
          doctorProfile: {
            specialization: ['Dermatology', 'Cosmetic Dermatology'],
            experience: 10,
            qualifications: ['MD - Dermatology', 'MBBS', 'FAAD'],
            hospital: 'Skin & Beauty Hospital',
            consultationFee: 1000,
            languages: ['English', 'Spanish'],
            rating: 4.7,
            bio: 'Dermatologist specializing in medical and cosmetic dermatology.'
          }
        },
        {
          _id: '4',
          name: 'Dr. Robert Wilson',
          email: 'dr.robert@empathy.ai',
          role: 'DOCTOR',
          isOnline: false, // Will be updated by Socket.IO
          doctorProfile: {
            specialization: ['Orthopedics', 'Sports Medicine'],
            experience: 15,
            qualifications: ['MS - Orthopedics', 'MBBS', 'FACS'],
            hospital: 'Orthopedic Excellence Center',
            consultationFee: 1800,
            languages: ['English', 'French'],
            rating: 4.6,
            bio: 'Orthopedic surgeon specializing in sports injuries and joint replacements.'
          }
        }
      ]);
    };

    fetchUser();
    setDefaultDoctors();
    fetchAppointments();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Listen for real-time doctor status updates
  useEffect(() => {
    const cleanup = onDoctorStatusUpdate((update) => {
      setDoctors(prevDoctors =>
        prevDoctors.map(doctor =>
          doctor._id === update.doctorId
            ? { ...doctor, isOnline: update.isOnline }
            : doctor
        )
      );

      // Also update appointments with the doctor's online status
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.doctorId?._id === update.doctorId
            ? {
                ...appointment,
                doctorId: {
                  ...appointment.doctorId,
                  isOnline: update.isOnline
                }
              }
            : appointment
        )
      );
    });

    return cleanup;
  }, []);

  // Fetch user's appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/appointments`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      } else {
        console.error('Failed to fetch appointments:', response.status);
        // Set default appointments if API fails
        setAppointments([
          {
            _id: '1',
            doctorId: { name: 'Dr. Sarah Johnson' },
            scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            scheduledTime: '14:00',
            status: 'CONFIRMED',
            notes: 'Regular checkup'
          },
          {
            _id: '2',
            doctorId: { name: 'Dr. Michael Chen' },
            scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            scheduledTime: '10:30',
            status: 'SCHEDULED',
            notes: 'Follow-up consultation'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      // Set default appointments if API fails
      setAppointments([
        {
          _id: '1',
          doctorId: { name: 'Dr. Sarah Johnson' },
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          scheduledTime: '14:00',
          status: 'CONFIRMED',
          notes: 'Regular checkup'
        },
        {
          _id: '2',
          doctorId: { name: 'Dr. Michael Chen' },
          scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          scheduledTime: '10:30',
          status: 'SCHEDULED',
          notes: 'Follow-up consultation'
        }
      ]);
    }
  };

  // Open cancel modal
  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  // Cancel appointment
  const cancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(`${API_URL}/api/appointments/${selectedAppointment._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Update the appointment status locally
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment._id === selectedAppointment._id
              ? { ...appointment, status: 'CANCELLED' }
              : appointment
          )
        );
        closeCancelModal();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Error cancelling appointment');
    }
  };

  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNewAppointmentDate(appointment.scheduledDate.split('T')[0]);
    setNewAppointmentTime(appointment.scheduledTime);
    setShowRescheduleModal(true);
  };

  // Close reschedule modal
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setNewAppointmentDate('');
    setNewAppointmentTime('');
  };

  // Reschedule appointment
  const rescheduleAppointment = async () => {
    if (!selectedAppointment || !newAppointmentDate || !newAppointmentTime) return;

    try {
      const response = await fetch(`${API_URL}/api/appointments/${selectedAppointment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scheduledDate: newAppointmentDate,
          scheduledTime: newAppointmentTime
        })
      });

      if (response.ok) {
        // Update the appointment locally
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment._id === selectedAppointment._id
              ? { ...appointment, scheduledDate: newAppointmentDate, scheduledTime: newAppointmentTime }
              : appointment
          )
        );
        closeRescheduleModal();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reschedule appointment');
      }
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      alert('Error rescheduling appointment');
    }
  };


  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      text: chatInput,
      senderRole: 'PATIENT',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: chatInput,
          roomId: `patient-ai-${user?.id || 'guest'}`,
          sessionId: `session-${Date.now()}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          text: data.aiResponse,
          senderRole: 'AI',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
          senderRole: 'AI',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = 'Sorry, I\'m having trouble connecting right now. Please try again later.';

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorText = 'It looks like the server is currently unavailable. Please check your connection and try again.';
      } else if (error.message.includes('500')) {
        errorText = 'There seems to be a server issue. Our team has been notified. Please try again in a few moments.';
      }

      const errorMessage = {
        text: errorText,
        senderRole: 'AI',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Healthcare Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🏥</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Patient Health Portal
                  </h1>
                  <p className="text-slate-600 mt-1">Secure access to your healthcare services</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-slate-500 font-medium">Current Session</div>
                <div className="font-semibold text-slate-900">{user?.name || 'Patient'}</div>
              </div>
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Professional Health Status Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Health Status: Good</h3>
                <p className="text-slate-600 text-sm">Your recent checkup shows excellent health indicators</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Last Updated</div>
              <div className="font-medium text-slate-900">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Main Healthcare Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Appointments Service */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">📅</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Medical Appointments</h2>
                  <p className="text-slate-600">Schedule consultations with specialists</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Upcoming Appointment</div>
                  <div className="text-sm text-slate-600">Tomorrow at 2:00 PM</div>
                  <div className="text-sm text-blue-600 font-medium">Dr. Sarah Johnson - Cardiology</div>
                </div>
                <div className="text-2xl">🏥</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowAppointments(true)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                📅 Schedule New Appointment
              </button>
              <button
                onClick={() => setShowAllAppointments(true)}
                className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors font-medium border border-slate-300"
              >
                📋 View All Appointments
              </button>
            </div>
          </div>

          {/* AI Health Assistant Service */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">AI Health Assistant</h2>
                  <p className="text-slate-600">24/7 medical guidance & support</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Health Consultations</div>
                  <div className="text-sm text-slate-600">15 sessions this week</div>
                  <div className="text-sm text-green-600 font-medium">Available 24/7</div>
                </div>
                <div className="text-2xl">💬</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowChat(true);
                  if (chatMessages.length === 0) {
                    setChatMessages([{
                      text: "Hello! I'm your AI Health Assistant. I'm here to provide medical guidance, answer health questions, and support your healthcare journey. How can I assist you today?",
                      senderRole: 'AI',
                      timestamp: new Date()
                    }]);
                  }
                }}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                💬 Start Health Consultation
              </button>
              <div className="text-center text-sm text-slate-600">
                HIPAA compliant • Secure & confidential
              </div>
            </div>
          </div>
        </div>

        {/* Inspirational Healthcare Quotes Section */}
        <div className="space-y-8">
          {/* Featured Quote */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm border border-blue-100">
            <div className="text-center">
              <div className="text-6xl mb-4">💙</div>
              <blockquote className="text-2xl font-medium text-slate-800 italic mb-4 leading-relaxed">
                "The greatest wealth is health. Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship."
              </blockquote>
              <cite className="text-slate-600 font-medium">- Buddha</cite>
            </div>
          </div>

          {/* Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">🌱</div>
                <blockquote className="text-lg font-medium text-slate-700 italic mb-3">
                  "Take care of your body. It's the only place you have to live."
                </blockquote>
                <cite className="text-slate-500 text-sm">- Jim Rohn</cite>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">💪</div>
                <blockquote className="text-lg font-medium text-slate-700 italic mb-3">
                  "Your body hears everything your mind says. Stay positive!"
                </blockquote>
                <cite className="text-slate-500 text-sm">- Naomi Judd</cite>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">🫀</div>
                <blockquote className="text-lg font-medium text-slate-700 italic mb-3">
                  "The first wealth is health. Keep your body fit and strong."
                </blockquote>
                <cite className="text-slate-500 text-sm">- Ralph Waldo Emerson</cite>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">🌿</div>
                <blockquote className="text-lg font-medium text-slate-700 italic mb-3">
                  "Prevention is better than cure. Take care of your health now."
                </blockquote>
                <cite className="text-slate-500 text-sm">- Traditional Wisdom</cite>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">🧘</div>
                <blockquote className="text-lg font-medium text-slate-700 italic mb-3">
                  "The mind and body are not separate. What affects one, affects the other."
                </blockquote>
                <cite className="text-slate-500 text-sm">- Aristotle</cite>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-3xl mb-3">🏃</div>
                <blockquote className="text-lg font-medium text-slate-700 italic mb-3">
                  "Movement is a medicine for creating change in a person's physical, emotional, and mental states."
                </blockquote>
                <cite className="text-slate-500 text-sm">- Carol Welch</cite>
              </div>
            </div>
          </div>

          {/* Motivational Health Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl shadow-sm border border-green-100">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Your Health Journey Matters</h3>
              <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Every step you take towards better health is a victory. Whether it's scheduling that doctor's appointment,
                starting a new wellness routine, or simply taking time for self-care, you're investing in the most valuable
                asset you have - your health. Remember, small consistent actions lead to remarkable transformations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Appointments Modal */}
      {showAppointments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">📅 Book Appointment</h2>
              <button
                onClick={() => setShowAppointments(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <AppointmentBooking onAppointmentBooked={fetchAppointments} />

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Booking Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Choose a time that works best for your schedule</li>
                  <li>• Prepare questions you want to ask your doctor</li>
                  <li>• Arrive 15 minutes early for your appointment</li>
                  <li>• Bring any relevant medical records or test results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Appointments Modal */}
      {showAllAppointments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">📋 All Appointments</h2>
              <button
                onClick={() => setShowAllAppointments(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                  <p className="text-gray-600 mb-6">You haven't scheduled any appointments yet.</p>
                  <button
                    onClick={() => {
                      setShowAllAppointments(false);
                      setShowAppointments(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Your Appointments</h3>
                    <span className="text-sm text-gray-600">{appointments.length} appointment(s)</span>
                  </div>

                  {appointments
                    .sort((a, b) => {
                      // Sort by date first (most recent first)
                      const dateA = new Date(a.scheduledDate);
                      const dateB = new Date(b.scheduledDate);

                      if (dateA.getTime() !== dateB.getTime()) {
                        return dateB.getTime() - dateA.getTime(); // Most recent date first
                      }

                      // If dates are the same, sort by time (earliest first)
                      const timeA = a.scheduledTime || '00:00';
                      const timeB = b.scheduledTime || '00:00';
                      return timeA.localeCompare(timeB);
                    })
                    .map(appointment => (
                    <div key={appointment._id} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-lg">
                              {appointment.doctorId?.name?.charAt(0)?.toUpperCase() || 'D'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{appointment.doctorId?.name || 'Doctor'}</h4>
                            <p className="text-sm text-gray-600">{appointment.doctorId?.doctorProfile?.specialization?.join(', ') || 'Healthcare Professional'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </div>
                          {appointment.status === 'CONFIRMED' && appointment.doctorId?.isOnline && (
                            <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Online
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Date & Time</div>
                          <div className="font-medium text-gray-900">
                            {new Date(appointment.scheduledDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">{appointment.scheduledTime}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-medium text-gray-900">{appointment.duration || 60} minutes</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Type</div>
                          <div className="font-medium text-gray-900">Consultation</div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500">Notes</div>
                          <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                            {appointment.notes}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-3">
                        {appointment.status === 'SCHEDULED' && (
                          <button
                            onClick={() => openCancelModal(appointment)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                          >
                            Cancel Appointment
                          </button>
                        )}
                        <button
                          onClick={() => openRescheduleModal(appointment)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer">
                          📹 Video Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">🤖 AI Health Assistant</h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto border">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🌿</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to AI Health Assistant</h3>
                    <p className="text-gray-600">
                      I'm here to provide guidance on wellness, answer your health questions, and support your journey to better health.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.senderRole === 'PATIENT' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-3 rounded-lg ${
                          msg.senderRole === 'PATIENT'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}>
                          <div className="font-medium text-sm mb-1">
                            {msg.senderRole === 'PATIENT' ? 'You' : 'AI Health Assistant'}
                          </div>
                          <div dangerouslySetInnerHTML={{
                            __html: msg.text
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">$1</a>')
                          }} />
                          <div className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg text-gray-600">
                          <div className="font-medium text-sm mb-1">AI Health Assistant</div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Invisible element to scroll to */}
                <div ref={chatMessagesEndRef} />
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your health..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isTyping ? '...' : 'Send'}
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  💡 Try asking about symptoms, wellness tips, medication, or general health advice
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Cancel Appointment</h2>
              <button
                onClick={closeCancelModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to cancel your appointment with <strong>{selectedAppointment.doctorId?.name}</strong>?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div><strong>Date:</strong> {new Date(selectedAppointment.scheduledDate).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> {selectedAppointment.scheduledTime}</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={cancelAppointment}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reschedule Appointment</h2>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Reschedule your appointment with <strong>{selectedAppointment.doctorId?.name}</strong>
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Date</label>
                    <input
                      type="date"
                      value={newAppointmentDate}
                      onChange={(e) => setNewAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Time</label>
                    <input
                      type="time"
                      value={newAppointmentTime}
                      onChange={(e) => setNewAppointmentTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={closeRescheduleModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={rescheduleAppointment}
                  disabled={!newAppointmentDate || !newAppointmentTime}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Healthcare Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🏥</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">EmpathyAI Healthcare</h3>
                  <p className="text-slate-400 text-sm">Committed to your health and wellness</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Providing comprehensive healthcare services with cutting-edge technology and compassionate care.
                Your health and privacy are our top priorities.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Emergency Services</h4>
              <div className="space-y-2">
                <p className="text-slate-300 text-sm">
                  <span className="font-medium text-red-400">🚨 Emergency:</span> 108
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium text-blue-400">🏥 Ambulance:</span> 102
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium text-green-400">💊 Poison Control:</span> 1800-11-0110
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support & Contact</h4>
              <div className="space-y-2">
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">📧 Email:</span> support@empathyai.com
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">📱 Phone:</span> 1800-123-4567
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">🕒 Hours:</span> 24/7 Available
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-slate-400 text-sm">
                  "Your health is our priority. We're here to support you every step of the way."
                </p>
              </div>
              <div className="flex space-x-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">HIPAA Compliance</a>
              </div>
            </div>
            <div className="text-center mt-6 pt-6 border-t border-slate-700">
              <p className="text-slate-500 text-xs">
                © 2025 EmpathyAI Healthcare. All rights reserved. | Licensed Healthcare Technology Platform
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
