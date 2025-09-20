import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { authenticateUser } from '../../utils/socket';
import AssignedPatientsList from '../../components/doctor/AssignedPatientsList';
import SessionManagement from '../../components/doctor/SessionManagement';
import DoctorNotes from '../../components/doctor/DoctorNotes';
import FeedbackViewing from '../../components/doctor/FeedbackViewing';
import PatientManagement from '../../components/doctor/PatientManagement';
import AppointmentHandling from '../../components/doctor/AppointmentHandling';
import NoteTaking from '../../components/doctor/NoteTaking';
import ProgressTracking from '../../components/doctor/ProgressTracking';
import PatientChatList from '../../components/doctor/PatientChatList';

export default function DoctorDashboard(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // Authenticate with Socket.IO for real-time features
        try {
          await authenticateUser(data.user._id, data.user.role);
          console.log('Doctor Socket.IO authentication successful');
        } catch (socketError) {
          console.error('Doctor Socket.IO authentication failed:', socketError);
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
      console.error('Error checking user role:', err);
      // If it's a network error or server is down, don't show error to user
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.log('Server appears to be down - running in offline mode');
        setUser(null);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      text: chatInput,
      senderRole: 'DOCTOR',
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
          roomId: `doctor-ai-${user?.id || 'guest'}`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'DOCTOR') {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'appointments', label: 'My Appointments', icon: '📅' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Healthcare Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Dr. {user.name}
                </h1>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                  👨‍⚕️ Healthcare Professional
                </div>
              </div>
              <p className="text-gray-600 mt-2 text-sm sm:text-base md:text-lg">Welcome back - Making a difference in healthcare, one patient at a time</p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-end">
              <div className="text-right">
                <div className="text-xs sm:text-sm text-gray-500">Today's Sessions</div>
                <div className="font-semibold text-sm sm:text-base">5 Active</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">
                  {user.name?.charAt(0)?.toUpperCase() || 'D'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Inspirational Quote for Doctors - Moved to Top */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-6 sm:p-8 rounded-xl shadow-lg border border-emerald-100 mb-6 sm:mb-8">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl mb-4">🌟</div>
            <blockquote className="text-lg sm:text-xl font-medium text-emerald-800 italic mb-4 leading-relaxed max-w-4xl mx-auto">
              "The best way to find yourself is to lose yourself in the service of others."
            </blockquote>
            <cite className="text-emerald-600 font-semibold text-base sm:text-lg">- Mahatma Gandhi</cite>
            <p className="text-emerald-600 mt-3 font-medium text-sm sm:text-base">Remember why you chose this noble profession</p>
          </div>
        </div>

        {/* Healthcare Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-100 text-xs sm:text-sm">Active Patients</div>
                <div className="text-xl sm:text-2xl font-bold">24</div>
                <div className="text-emerald-100 text-xs mt-1">Under your care</div>
              </div>
              <div className="text-3xl sm:text-4xl">👥</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-teal-100 text-xs sm:text-sm">Today's Appointments</div>
                <div className="text-xl sm:text-2xl font-bold">8</div>
                <div className="text-teal-100 text-xs mt-1">Scheduled sessions</div>
              </div>
              <div className="text-3xl sm:text-4xl">📅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-xs sm:text-sm">Pending Reviews</div>
                <div className="text-xl sm:text-2xl font-bold">3</div>
                <div className="text-blue-100 text-xs mt-1">Requires attention</div>
              </div>
              <div className="text-3xl sm:text-4xl">📋</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-4 sm:p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-cyan-100 text-xs sm:text-sm">Messages</div>
                <div className="text-xl sm:text-2xl font-bold">12</div>
                <div className="text-cyan-100 text-xs mt-1">Patient communications</div>
              </div>
              <div className="text-3xl sm:text-4xl">💬</div>
            </div>
          </div>
        </div>

        {/* Main Content - Appointments Only */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl mr-3 sm:mr-4">📅</div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Appointments</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your scheduled appointments and patient sessions</p>
            </div>
          </div>
          <AppointmentHandling />
        </div>
      </div>
    </div>
  );
}
