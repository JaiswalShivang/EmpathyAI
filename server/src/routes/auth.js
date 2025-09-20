const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { requireAuth } = require('../middlewares/auth');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const approved = role === 'DOCTOR' ? false : true;
    const user = new User({ name, email, password: hashed, role, approved });
    await user.save();
    res.status(201).json({ message: 'Registered successfully', user: { id: user._id, email: user.email, role: user.role, approved: user.approved } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.role === 'DOCTOR' && !user.approved) return res.status(403).json({ message: 'Doctor account pending admin approval' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: user.role, email: user.email });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000
    });
    res.json({ role: user.role, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('token', { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
});
router.get('/me', requireAuth, async (req, res) => {
  try {
    const id = req.user && req.user.id;
    const user = await User.findById(id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
