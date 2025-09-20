import React, { useState, useEffect } from 'react';

export default function DoctorNotes() {
  const [notes, setNotes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    content: '',
    isPrivate: true
  });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
    fetchPatients();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/doctorNotes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.notes);
    } catch (err) {
      setError('Error fetching notes: ' + err.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();

      // Get unique patients
      const patientMap = new Map();
      data.appointments.forEach(apt => {
        patientMap.set(apt.patientId._id, apt.patientId);
      });
      setPatients(Array.from(patientMap.values()));
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.content) return;

    try {
      const url = editingNote ? `/api/doctorNotes/${editingNote._id}` : '/api/doctorNotes';
      const method = editingNote ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchNotes();
        setShowForm(false);
        setFormData({ patientId: '', content: '', isPrivate: true });
        setEditingNote(null);
      }
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleEdit = (note) => {
    setFormData({
      patientId: note.patientId._id,
      content: note.content,
      isPrivate: note.isPrivate
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/doctorNotes/${noteId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchNotes();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Doctor Notes</h2>
        <div className="text-center py-4">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Doctor Notes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Note'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Note Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-2 border rounded"
                rows="4"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isPrivate" className="text-sm">Private note (not visible to patient)</label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {editingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      )}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {notes.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No notes yet</div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{note.patientId.name}</h3>
                    {note.isPrivate && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Private</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{note.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}