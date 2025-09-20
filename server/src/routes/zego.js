const express = require('express');
const { generateZegoToken } = require('../utils/zegoToken');
const router = express.Router();

// Generate ZegoCloud token
router.post('/generate-token', (req, res) => {
  try {
    const { userId, userName, roomId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get credentials from environment variables
    const appId = process.env.ZEGO_APP_ID || 'YOUR_ZEGO_APP_ID';
    const serverSecret = process.env.ZEGO_SERVER_SECRET || 'YOUR_ZEGO_SERVER_SECRET';

    if (appId === 'YOUR_ZEGO_APP_ID' || serverSecret === 'YOUR_ZEGO_SERVER_SECRET') {
      return res.status(500).json({
        error: 'ZegoCloud credentials not configured. Please set ZEGO_APP_ID and ZEGO_SERVER_SECRET environment variables.'
      });
    }

    // Generate token with 1 hour expiration
    const token = generateZegoToken(appId, serverSecret, userId, 3600, roomId || '');

    res.json({
      token,
      appId: parseInt(appId),
      serverSecret, // Include server secret for client-side initialization
      userId,
      userName: userName || userId,
      roomId: roomId || 'default_room'
    });

  } catch (error) {
    console.error('Error generating Zego token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

module.exports = router;