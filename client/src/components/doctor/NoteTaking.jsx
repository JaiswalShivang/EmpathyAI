import React, { useState, useEffect } from 'react';

export default function NoteTaking() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [note, setNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTodaysAppointments();
  }, []);

  const fetchTodaysAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();

      const today = new Date().toISOString().split('T')[0];
      const todaysAppointments = data.appointments.filter(apt =>
        apt.scheduledDate.startsWith(today) &&
        (apt.status === 'CONFIRMED' || apt.status === 'COMPLETED')
      );
      setAppointments(todaysAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment || !note.trim()) {
      setMessage('Please select an appointment and enter a note');
      return;
    }

    setLoading(true);
    try {
      const appointment = appointments.find(apt => apt._id === selectedAppointment);
      const response = await fetch('/api/doctorNotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: appointment.patientId._id,
          appointmentId: selectedAppointment,
          content: note,
          isPrivate
        })
      });

      if (response.ok) {
        setMessage('Note saved successfully!');
        setNote('');
        setSelectedAppointment('');
        setIsPrivate(true);
      } else {
        setMessage('Failed to save note');
      }
    } catch (err) {
      setMessage('Error saving note: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Quick Note Taking</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Session</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choose an appointment</option>
            {appointments.map((apt) => (
              <option key={apt._id} value={apt._id}>
                {apt.patientId.name} - {apt.scheduledTime} ({apt.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Enter your notes here..."
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPrivate" className="text-sm">Private note</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  );
}