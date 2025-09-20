import React, { useState, useEffect } from 'react';

export default function ProgressTracking() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatientProgress();
  }, []);

  const fetchPatientProgress = async () => {
    try {
      // Fetch appointments and feedback
      const [appointmentsRes, feedbackRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/feedback')
      ]);

      if (!appointmentsRes.ok || !feedbackRes.ok) throw new Error('Failed to fetch data');

      const appointmentsData = await appointmentsRes.json();
      const feedbackData = await feedbackRes.json();

      // Group data by patient
      const patientMap = new Map();

      // Process appointments
      appointmentsData.appointments.forEach(apt => {
        const patientId = apt.patientId._id;
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            ...apt.patientId,
            appointments: [],
            feedback: [],
            completedSessions: 0,
            totalSessions: 0,
            averageRating: 0
          });
        }
        const patient = patientMap.get(patientId);
        patient.appointments.push(apt);
        patient.totalSessions += 1;
        if (apt.status === 'COMPLETED') patient.completedSessions += 1;
      });

      // Process feedback
      feedbackData.feedback.forEach(fb => {
        const patientId = fb.patientId._id;
        if (patientMap.has(patientId)) {
          patientMap.get(patientId).feedback.push(fb);
        }
      });

      // Calculate averages
      patientMap.forEach(patient => {
        if (patient.feedback.length > 0) {
          const totalRating = patient.feedback.reduce((sum, fb) => sum + fb.rating, 0);
          patient.averageRating = (totalRating / patient.feedback.length).toFixed(1);
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (err) {
      setError('Error fetching progress data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Progress Tracking</h2>
        <div className="text-center py-4">Loading progress data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Progress Tracking</h2>
        <div className="text-center py-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patient Progress Tracking</h2>
      {patients.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No patient data available</div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Completion Rate: {patient.totalSessions > 0 ? Math.round((patient.completedSessions / patient.totalSessions) * 100) : 0}%
                  </div>
                  {patient.averageRating > 0 && (
                    <div className="flex items-center mt-1">
                      {renderStars(patient.averageRating)}
                      <span className="ml-1 text-sm text-gray-600">({patient.averageRating})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium text-blue-800">Total Sessions</div>
                  <div className="text-2xl font-bold text-blue-600">{patient.totalSessions}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-medium text-green-800">Completed</div>
                  <div className="text-2xl font-bold text-green-600">{patient.completedSessions}</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="font-medium text-yellow-800">Feedback Count</div>
                  <div className="text-2xl font-bold text-yellow-600">{patient.feedback.length}</div>
                </div>
              </div>

              {patient.feedback.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recent Feedback</h4>
                  <div className="space-y-2">
                    {patient.feedback.slice(0, 2).map((fb) => (
                      <div key={fb._id} className="bg-gray-50 p-3 rounded text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                          <div className="flex">{renderStars(fb.rating)}</div>
                        </div>
                        {fb.comment && <p className="text-gray-700">{fb.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}