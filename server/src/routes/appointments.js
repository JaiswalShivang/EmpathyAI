const express = require('express');
const Appointment = require('../models/Appointment');
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/roleGuard');
const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get approved doctors - patients can see doctors to book
router.get('/doctors', permit('PATIENT'), async (req, res) => {
  try {
    const User = require('../models/User');
    const doctors = await User.find({ role: 'DOCTOR', approved: true }).select('name email _id');
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment - patients only
router.post('/', permit('PATIENT'), async (req, res) => {
  try {
    const { doctorId, scheduledDate, scheduledTime, duration, notes } = req.body;
    if (!doctorId || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      scheduledDate,
      scheduledTime,
      duration: duration || 60,
      notes
    });
    await appointment.save();
    await appointment.populate('patientId', 'name email');
    await appointment.populate('doctorId', 'name email');
    res.status(201).json({ appointment });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Quick booking - patients only (creates pending appointment)
router.post('/quick-book', permit('PATIENT'), async (req, res) => {
  try {
    const { doctorName, scheduledDate, scheduledTime, duration, notes } = req.body;
    if (!doctorName || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create appointment with doctor name stored in notes for admin review
    const appointmentNotes = `Quick booking request for: ${doctorName}\n\nPatient Notes: ${notes || 'No additional notes'}`;

    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId: null, // Will be assigned by admin later
      scheduledDate,
      scheduledTime,
      duration: duration || 60,
      notes: appointmentNotes,
      status: 'PENDING' // Custom status for quick bookings
    });

    await appointment.save();
    await appointment.populate('patientId', 'name email');

    res.status(201).json({
      message: 'Appointment request submitted successfully. Our team will contact you within 24 hours.',
      appointment
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments - filtered by role
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'PATIENT') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'DOCTOR') {
      query.doctorId = req.user.id;
    }
    // Admins see all
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ scheduledDate: 1, scheduledTime: 1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Check access
    if (req.user.role === 'PATIENT' && appointment.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role === 'DOCTOR' && appointment.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment - doctors and admins
router.put('/:id', permit('DOCTOR', 'ADMIN'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Doctors can only update their own appointments
    if (req.user.role === 'DOCTOR' && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    appointment.updatedAt = new Date();
    await appointment.save();
    await appointment.populate('patientId', 'name email');
    await appointment.populate('doctorId', 'name email');
    res.json({ appointment });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment - patients and doctors
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Check access
    if (req.user.role === 'PATIENT' && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role === 'DOCTOR' && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    appointment.status = 'CANCELLED';
    appointment.updatedAt = new Date();
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;