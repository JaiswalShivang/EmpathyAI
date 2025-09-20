import React, { useState, useEffect } from 'react';

export default function FeedbackForm() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      // Filter completed appointments
      const completed = data.appointments.filter(app => app.status === 'COMPLETED');
      setAppointments(completed);
    } catch (err) {
      setMessage('Error fetching appointments: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment || !rating) {
      setMessage('Please select an appointment and provide a rating');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: selectedAppointment,
          rating: parseInt(rating),
          comment
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Feedback submitted successfully!');
        // Reset form
        setSelectedAppointment('');
        setRating(5);
        setComment('');
        // Refresh appointments to remove the one with feedback
        fetchAppointments();
      } else {
        setMessage(data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Post-Session Feedback</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Completed Appointment</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choose an appointment</option>
            {appointments.map((app) => (
              <option key={app._id} value={app._id}>
                {app.doctorId.name} - {new Date(app.scheduledDate).toLocaleDateString()} at {app.scheduledTime}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Share your experience..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}