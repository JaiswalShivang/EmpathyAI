import React, { useState, useEffect } from 'react';

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();

      // Group appointments by patient and get detailed info
      const patientMap = new Map();
      data.appointments.forEach(appointment => {
        const patientId = appointment.patientId._id;
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            ...appointment.patientId,
            appointments: [],
            totalAppointments: 0,
            completedAppointments: 0,
            lastAppointment: null
          });
        }
        const patient = patientMap.get(patientId);
        patient.appointments.push(appointment);
        patient.totalAppointments += 1;
        if (appointment.status === 'COMPLETED') patient.completedAppointments += 1;
        if (!patient.lastAppointment ||
            new Date(appointment.scheduledDate) > new Date(patient.lastAppointment.scheduledDate)) {
          patient.lastAppointment = appointment;
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
        <h2 className="text-xl font-semibold mb-4">Patient Management</h2>
        <div className="text-center py-4">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient Management</h2>
        <div className="text-center py-4 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Patient Management</h2>
      {patients.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No patients found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((patient) => (
            <div key={patient._id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                 onClick={() => setSelectedPatient(selectedPatient?._id === patient._id ? null : patient)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Total Appointments: {patient.totalAppointments}</p>
                    <p>Completed: {patient.completedAppointments}</p>
                    {patient.lastAppointment && (
                      <p>Last: {new Date(patient.lastAppointment.scheduledDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    patient.completedAppointments > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.completedAppointments > 0 ? 'Active' : 'New'}
                  </span>
                </div>
              </div>

              {selectedPatient?._id === patient._id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Appointment History</h4>
                  <div className="space-y-2">
                    {patient.appointments.slice(0, 5).map((apt) => (
                      <div key={apt._id} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="flex justify-between">
                          <span>{new Date(apt.scheduledDate).toLocaleDateString()} at {apt.scheduledTime}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        {apt.notes && <p className="text-gray-600 mt-1">{apt.notes}</p>}
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