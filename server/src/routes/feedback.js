const express = require('express');
const Feedback = require('../models/Feedback');
const Appointment = require('../models/Appointment');
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/roleGuard');
const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create feedback - patients only
router.post('/', permit('PATIENT'), async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    if (!appointmentId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    // Check if appointment exists and belongs to the patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // Check if feedback already exists for this appointment
    const existingFeedback = await Feedback.findOne({ appointmentId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already exists for this appointment' });
    }
    const feedback = new Feedback({
      patientId: req.user.id,
      doctorId: appointment.doctorId,
      appointmentId,
      rating,
      comment
    });
    await feedback.save();
    await feedback.populate('patientId', 'name email');
    await feedback.populate('doctorId', 'name email');
    await feedback.populate('appointmentId');
    res.status(201).json({ feedback });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback - filtered by role
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'PATIENT') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'DOCTOR') {
      query.doctorId = req.user.id;
    }
    // Admins see all
    const feedback = await Feedback.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific feedback
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .populate('appointmentId');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    // Check access
    if (req.user.role === 'PATIENT' && feedback.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role === 'DOCTOR' && feedback.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;