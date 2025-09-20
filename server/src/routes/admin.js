const express = require('express');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');
const Feedback = require('../models/Feedback');
const MeditationResource = require('../models/MeditationResource');
const DoctorNote = require('../models/DoctorNote');
const { requireAuth } = require('../middlewares/auth');
const { permit } = require('../middlewares/roleGuard');
const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(permit('ADMIN'));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a user (for doctors)
router.put('/users/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'DOCTOR') return res.status(400).json({ message: 'Only doctors can be approved' });
    user.approved = true;
    await user.save();
    res.json({ message: 'User approved', user: { id: user._id, name: user.name, email: user.email, role: user.role, approved: user.approved } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deletion of admin users for security
    if (user.role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'PATIENT' });
    const totalDoctors = await User.countDocuments({ role: 'DOCTOR' });
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });
    const pendingDoctors = await User.countDocuments({ role: 'DOCTOR', approved: false });
    const totalChats = await Chat.countDocuments();
    const totalAppointments = await require('../models/Appointment').countDocuments();
    const totalFeedback = await require('../models/Feedback').countDocuments();
    const totalMeditationResources = await require('../models/MeditationResource').countDocuments();
    const totalDoctorNotes = await require('../models/DoctorNote').countDocuments();
    res.json({
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAdmins,
      pendingDoctors,
      totalChats,
      totalAppointments,
      totalFeedback,
      totalMeditationResources,
      totalDoctorNotes
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chat logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await Chat.find().populate('senderId', 'name email role').sort({ createdAt: -1 }).limit(100);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ scheduledDate: -1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all feedback
router.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all meditation resources
router.get('/meditation-resources', async (req, res) => {
  try {
    const resources = await MeditationResource.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all doctor notes
router.get('/doctor-notes', async (req, res) => {
  try {
    const notes = await DoctorNote.find()
      .populate('doctorId', 'name email')
      .populate('patientId', 'name email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete feedback
router.delete('/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete meditation resource
router.delete('/meditation-resources/:id', async (req, res) => {
  try {
    await MeditationResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete doctor note
router.delete('/doctor-notes/:id', async (req, res) => {
  try {
    await DoctorNote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;