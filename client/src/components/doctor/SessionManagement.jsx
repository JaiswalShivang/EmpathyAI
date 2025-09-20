import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SessionManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodaysAppointments();
  }, []);

  const fetchTodaysAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();

      // Filter for today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todaysAppointments = data.appointments.filter(apt =>
        apt.scheduledDate.startsWith(today) &&
        (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED')
      );

      setAppointments(todaysAppointments);
    } catch (err) {
      setError('Error fetching appointments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // Update local state
        setAppointments(appointments.map(apt =>
          apt._id === appointmentId ? { ...apt, status } : apt
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Sessions</h2>
        <div className="text-center py-4">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Sessions</h2>
        <div className="text-center py-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Today's Sessions</h2>
      {appointments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No sessions scheduled for today</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {appointment.patientId.name}
                  </h3>
                  <p className="text-sm text-gray-600">{appointment.patientId.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {appointment.scheduledTime} - {appointment.duration} minutes
                  </p>
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mt-1">Notes: {appointment.notes}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'SCHEDULED' && (
                    <button
                      onClick={() => updateAppointmentStatus(appointment._id, 'CONFIRMED')}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
                  )}
                  <Link
                    to={`/doctor/chat/${appointment.patientId._id}`}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                  >
                    Join Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}