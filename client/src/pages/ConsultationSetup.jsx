import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationRoom from '../components/ConsultationRoom';

export default function ConsultationSetup() {
  const [selectedRole, setSelectedRole] = useState('');
  const [showConsultation, setShowConsultation] = useState(false);
  const navigate = useNavigate();

  const handleStartConsultation = () => {
    if (selectedRole) {
      setShowConsultation(true);
    }
  };

  if (showConsultation) {
    return <ConsultationRoom role={selectedRole} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Consultation</h1>
          <p className="text-gray-600">Choose your role to start the consultation</p>
        </div>

        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select Your Role
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="DOCTOR"
                  checked={selectedRole === 'DOCTOR'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">👨‍⚕️ Doctor</div>
                  <div className="text-sm text-gray-600">Healthcare professional conducting the consultation</div>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="PATIENT"
                  checked={selectedRole === 'PATIENT'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">🏥 Patient</div>
                  <div className="text-sm text-gray-600">Individual seeking medical consultation</div>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleStartConsultation}
            disabled={!selectedRole}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-lg"
          >
            🚀 Start Video Consultation
          </button>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">How to Test:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Open this page in two separate browser tabs</li>
            <li>2. Select "Doctor" in one tab and "Patient" in the other</li>
            <li>3. Click "Start Video Consultation" in both tabs</li>
            <li>4. Allow camera/microphone permissions when prompted</li>
            <li>5. You should see both video streams and be able to chat</li>
            <li>6. Check browser console for detailed connection logs</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}