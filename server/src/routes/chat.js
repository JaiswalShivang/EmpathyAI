const express = require('express');
const Chat = require('../models/Chat');
const SessionAnalytics = require('../models/SessionAnalytics');
const { requireAuth } = require('../middlewares/auth');
const { answerQuestion } = require('../services/aiService');
const router = express.Router();

// Save chat message
router.post('/save', requireAuth, async (req, res) => {
  try {
    const { roomId, sessionId, message, messageType = 'TEXT' } = req.body;
    const chat = await Chat.create({ roomId, sessionId, senderId: req.user.id, senderRole: req.user.role, message, messageType });
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a room
router.get('/room/:roomId', requireAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { sessionId } = req.query;
    const query = sessionId ? { roomId, sessionId } : { roomId };
    const msgs = await Chat.find(query).sort({ createdAt: 1 });
    res.json({ messages: msgs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message between doctor and patient
router.post('/send', requireAuth, async (req, res) => {
  try {
    const { recipientId, message, type = 'TEXT', sessionId } = req.body;
    const senderId = req.user.id;
    const senderRole = req.user.role;

    // Create room ID for doctor-patient conversation
    const roomId = `doctor-patient-${[senderId, recipientId].sort().join('-')}`;

    // Generate sessionId if not provided
    const finalSessionId = sessionId || `direct-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Save the message
    const chatMessage = await Chat.create({
      roomId,
      sessionId: finalSessionId,
      senderId,
      senderRole,
      message,
      messageType: type
    });

    res.json({ message: chatMessage });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages between doctor and patient
router.get('/messages/:recipientId', requireAuth, async (req, res) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.user.id;

    // Create room ID for doctor-patient conversation
    const roomId = `doctor-patient-${[senderId, recipientId].sort().join('-')}`;

    const messages = await Chat.find({ roomId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email');

    res.json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/ai', requireAuth, async (req, res) => {
  try {
    const { message, roomId, sessionId } = req.body;
    const userId = req.user.id;

    // Get AI response
    const aiResponse = await answerQuestion(userId, message);

    // Save user message
    await Chat.create({ roomId, sessionId, senderId: userId, senderRole: req.user.role, message });

    // Save AI response
    const aiChat = await Chat.create({ roomId, sessionId, senderId: null, senderRole: 'AI', message: aiResponse });

    res.json({ aiResponse, chat: aiChat });
  } catch (err) {
    console.error('AI Chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = await SessionAnalytics.find({ userId, sessionType: 'CHAT' }).sort({ date: -1 });
    res.json({ analytics });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
