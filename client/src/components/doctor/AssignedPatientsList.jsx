import React, { useState, useEffect } from 'react';

export default function AssignedPatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  const fetchAssignedPatients = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();

      // Group appointments by patient and get the latest appointment for each
      const patientMap = new Map();
      data.appointments.forEach(appointment => {
        const patientId = appointment.patientId._id;
        if (!patientMap.has(patientId) ||
            new Date(appointment.scheduledDate) > new Date(patientMap.get(patientId).scheduledDate)) {
          patientMap.set(patientId, {
            ...appointment.patientId,
            lastAppointment: appointment,
            appointmentCount: patientMap.has(patientId) ? patientMap.get(patientId).appointmentCount + 1 : 1
          });
        } else if (patientMap.has(patientId)) {
          patientMap.get(patientId).appointmentCount += 1;
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (err) {
      setError('Error fetching patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Assigned Patients</h2>
        <div className="text-center py-4">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Assigned Patients</h2>
        <div className="text-center py-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assigned Patients</h2>
      {patients.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No assigned patients yet</div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient._id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Appointments: {patient.appointmentCount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Last: {new Date(patient.lastAppointment.scheduledDate).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    patient.lastAppointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    patient.lastAppointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    patient.lastAppointment.status === 'CONFIRMED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.lastAppointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}