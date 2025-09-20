require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const appointmentRoutes = require('./routes/appointments');
const feedbackRoutes = require('./routes/feedback');
const meditationResourceRoutes = require('./routes/meditationResources');
const doctorNoteRoutes = require('./routes/doctorNotes');
const zegoRoutes = require('./routes/zego');
const { socketConnection } = require('./utils/socket');
const { generateZegoToken } = require('./utils/zegoToken');
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/empathy-ai');
const app = express();
app.use(express.json());
app.use(cookieParser());
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/meditation-resources', meditationResourceRoutes);
app.use('/api/doctor-notes', doctorNoteRoutes);
app.use('/api/zego', zegoRoutes);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Consultation token generation endpoint
app.post('/api/consultation/token', (req, res) => {
  try {
    const { userId, userName, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    // Get credentials from environment variables
    const appId = process.env.ZEGO_APP_ID || 'YOUR_ZEGO_APP_ID';
    const serverSecret = process.env.ZEGO_SERVER_SECRET || 'YOUR_ZEGO_SERVER_SECRET';

    if (appId === 'YOUR_ZEGO_APP_ID' || serverSecret === 'YOUR_ZEGO_SERVER_SECRET') {
      return res.status(500).json({
        error: 'ZegoCloud credentials not configured. Please set ZEGO_APP_ID and ZEGO_SERVER_SECRET environment variables.'
      });
    }

    // Generate token for consultation room
    const token = generateZegoToken(appId, serverSecret, userId, 3600, 'consultationRoom');

    console.log(`🔑 Generated consultation token for ${role}: ${userId} (token length: ${token.length})`);

    res.json({
      token,
      appId: parseInt(appId),
      serverSecret,
      userId,
      userName: userName || userId,
      roomId: 'consultationRoom',
      role
    });

  } catch (error) {
    console.error('Error generating consultation token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.get('/ping', (req, res) => res.send('pong'));
const server = http.createServer(app);
socketConnection(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
