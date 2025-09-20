const express = require('express');
const DoctorNote = require('../models/DoctorNote');
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/roleGuard');
const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create note - doctors only
router.post('/', permit('DOCTOR'), async (req, res) => {
  try {
    const { patientId, appointmentId, content, isPrivate } = req.body;
    if (!patientId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const note = new DoctorNote({
      doctorId: req.user.id,
      patientId,
      appointmentId,
      content,
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });
    await note.save();
    await note.populate('doctorId', 'name email');
    await note.populate('patientId', 'name email');
    if (appointmentId) await note.populate('appointmentId');
    res.status(201).json({ note });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes - filtered by role
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'DOCTOR') {
      query.doctorId = req.user.id;
    } else if (req.user.role === 'PATIENT') {
      query.patientId = req.user.id;
      query.isPrivate = false; // Patients can only see non-private notes
    }
    // Admins see all
    const notes = await DoctorNote.find(query)
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific note
router.get('/:id', async (req, res) => {
  try {
    const note = await DoctorNote.findById(req.params.id)
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .populate('appointmentId');
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    // Check access
    if (req.user.role === 'DOCTOR' && note.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role === 'PATIENT') {
      if (note.patientId._id.toString() !== req.user.id || note.isPrivate) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }
    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update note - doctor who created
router.put('/:id', permit('DOCTOR'), async (req, res) => {
  try {
    const note = await DoctorNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { content, isPrivate } = req.body;
    if (content) note.content = content;
    if (isPrivate !== undefined) note.isPrivate = isPrivate;
    note.updatedAt = new Date();
    await note.save();
    await note.populate('doctorId', 'name email');
    await note.populate('patientId', 'name email');
    if (note.appointmentId) await note.populate('appointmentId');
    res.json({ note });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note - doctor who created or admin
router.delete('/:id', async (req, res) => {
  try {
    const note = await DoctorNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    // Check permission
    if (req.user.role !== 'ADMIN' && note.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await DoctorNote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;