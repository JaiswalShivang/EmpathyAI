import React, { useState, useEffect } from 'react';

export default function FeedbackViewing() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedback(data.feedback);

      // Calculate average rating
      if (data.feedback.length > 0) {
        const total = data.feedback.reduce((sum, item) => sum + item.rating, 0);
        setAverageRating((total / data.feedback.length).toFixed(1));
      }
    } catch (err) {
      setError('Error fetching feedback: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Feedback</h2>
        <div className="text-center py-4">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Feedback</h2>
        <div className="text-center py-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patient Feedback</h2>

      {feedback.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">{averageRating}</span>
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-gray-600">({feedback.length} reviews)</span>
          </div>
        </div>
      )}

      {feedback.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No feedback yet</div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{item.patientId.name}</h3>
                  <p className="text-sm text-gray-600">{item.patientId.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(item.rating)}
                  <span className="text-sm text-gray-600 ml-1">({item.rating}/5)</span>
                </div>
              </div>

              {item.comment && (
                <p className="text-gray-700 mb-2">{item.comment}</p>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Appointment: {new Date(item.appointmentId.scheduledDate).toLocaleDateString()}
                </span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}