import React, { useState, useEffect } from 'react';

export default function AppointmentBooking({ onAppointmentBooked }) {
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/appointments/doctors`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setDoctors(data.doctors || []);
        } else {
          console.error('Failed to fetch doctors');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !scheduledDate || !scheduledTime) {
      setMessage('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doctorId,
          scheduledDate,
          scheduledTime,
          duration,
          notes
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Appointment booked successfully!');
        // Reset form
        setDoctorId('');
        setScheduledDate('');
        setScheduledTime('');
        setDuration(60);
        setNotes('');
        // Notify parent component to refresh appointments
        if (onAppointmentBooked) {
          onAppointmentBooked();
        }
      } else {
        setMessage(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="text-xl sm:text-2xl mr-3">📅</div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Appointment Booking</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <div className={`text-xl mr-3 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message.includes('successfully') ? '✅' : '❌'}
            </div>
            <div className="font-medium">{message}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">👨‍⚕️ Select Doctor</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.doctorProfile?.specialization?.join(', ') || 'Healthcare Professional'}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Select the doctor you wish to consult from the available options</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Preferred Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">⏰ Preferred Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Duration (minutes)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes (Standard)</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            rows="4"
            placeholder="Please describe your symptoms, concerns, or any specific requirements for your appointment..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || doctors.length === 0}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center font-semibold text-base sm:text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Booking Appointment...
              </>
            ) : (
              <>
                <span className="text-xl mr-3">📅</span>
                Book Appointment
              </>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>💡 <strong>Note:</strong> Your appointment will be confirmed immediately. You can view and manage your appointments in the dashboard.</p>
        </div>
      </form>
    </div>
  );
}