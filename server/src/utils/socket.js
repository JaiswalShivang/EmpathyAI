const { Server } = require("socket.io");
const Chat = require("../models/Chat");
const SessionAnalytics = require("../models/SessionAnalytics");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

let users = {};
let io;

const socketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // Authentication and online status
    socket.on('authenticate', async ({ userId, userRole }) => {
      try {
        const user = await User.findById(userId);
        if (user && user.role === userRole) {
          users[socket.id] = { userId, userRole, socketId: socket.id };
          socket.emit('authenticated', { success: true });
        } else {
          socket.emit('authenticated', { success: false, message: 'Authentication failed' });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('authenticated', { success: false, message: 'Server error' });
      }
    });

    // Session management
    socket.on('joinSession', async ({ sessionId, userId, userRole }) => {
      try {
        // Check if user has permission to join this session
        const hasPermission = await checkAppointmentAccess(userId, userRole, sessionId);

        if (!hasPermission) {
          socket.emit('joinError', { message: 'You do not have permission to join this session' });
          return;
        }

        socket.join(sessionId);
        users[socket.id] = { ...users[socket.id], sessionId };

        // Track session join
        try {
          await SessionAnalytics.create({
            userId,
            sessionType: 'CHAT',
            resourceId: sessionId,
            metadata: { action: 'join', role: userRole }
          });
        } catch (e) {}

        socket.to(sessionId).emit('userJoined', { userId, userRole });
      } catch (error) {
        console.error('Join session error:', error);
        socket.emit('joinError', { message: 'Failed to join session' });
      }
    });

    socket.on('leaveSession', async ({ sessionId, userId }) => {
      socket.leave(sessionId);
      socket.to(sessionId).emit('userLeft', { userId });
    });

    // Chat messages
    socket.on('sendMessage', async (data) => {
      io.to(data.sessionId).emit('receiveMessage', data);
      try {
        await Chat.create({
          roomId: data.roomId,
          sessionId: data.sessionId,
          senderId: data.senderId || null,
          senderRole: data.senderRole || 'PATIENT',
          message: data.text,
          messageType: 'TEXT'
        });
      } catch (e) {
        console.error('Error saving message:', e);
      }
    });

    // Direct messaging between doctor and patient
    socket.on('sendDirectMessage', async (data) => {
      try {
        const { recipientId, message, senderId, senderRole, sessionId } = data;

        // Create room ID for doctor-patient conversation
        const roomId = `doctor-patient-${[senderId, recipientId].sort().join('-')}`;

        // Find recipient's socket
        const recipientSocket = Object.values(users).find(user => user.userId === recipientId);

        if (recipientSocket) {
          // Send message to recipient via direct socket
          io.to(recipientSocket.socketId).emit('receiveDirectMessage', {
            senderId,
            senderRole,
            message,
            timestamp: new Date()
          });
        }

        // Also broadcast to the room for consistency
        socket.to(roomId).emit('receiveDirectMessage', {
          senderId,
          senderRole,
          message,
          timestamp: new Date()
        });

        // Save message to database
        const finalSessionId = sessionId || `direct-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await Chat.create({
          roomId,
          sessionId: finalSessionId,
          senderId,
          senderRole,
          message,
          messageType: 'TEXT'
        });

      } catch (error) {
        console.error('Direct message error:', error);
      }
    });

    socket.on('typing', ({ sessionId, userId, isTyping }) => {
      socket.to(sessionId).emit('userTyping', { userId, isTyping });
    });

    // Video calling
    socket.on('startVideoCall', async (data) => {
      try {
        const { roomId, callerId, callerName, receiverId } = data;

        // Find receiver's socket
        const receiverSocket = Object.values(users).find(user => user.userId === receiverId);

        if (receiverSocket) {
          // Get caller info
          const caller = await User.findById(callerId);

          // Send notification to receiver
          io.to(receiverSocket.socketId).emit('videoCallStarted', {
            roomId,
            callerId,
            callerName: caller?.name || callerName,
            receiverId
          });
        }
      } catch (error) {
        console.error('Start video call error:', error);
      }
    });

    socket.on('joinVideoCall', (data) => {
      const { roomId, userId, userName } = data;
      socket.join(roomId);
      socket.to(roomId).emit('videoCallJoined', { userId, userName });
    });

    socket.on('endVideoCall', (data) => {
      const { roomId, userId } = data;
      socket.to(roomId).emit('videoCallEnded', { userId });
      socket.leave(roomId);
    });

    // Video call signaling
    socket.on('videoOffer', (data) => {
      socket.to(data.sessionId).emit('videoOffer', data);
    });

    socket.on('videoAnswer', (data) => {
      socket.to(data.sessionId).emit('videoAnswer', data);
    });

    socket.on('iceCandidate', (data) => {
      socket.to(data.sessionId).emit('iceCandidate', data);
    });

    // Consultation room handling
    socket.on('joinConsultation', ({ userId, userName, role }) => {
      console.log(`👨‍⚕️ ${role} ${userName} (${userId}) joining consultation room`);
      socket.join('consultationRoom');
      users[socket.id] = { userId, userName, role, socketId: socket.id };

      // Notify others in the room
      socket.to('consultationRoom').emit('userJoinedConsultation', {
        userId,
        userName,
        role,
        timestamp: new Date()
      });

      // If doctor joins, notify all patients
      if (role === 'DOCTOR') {
        console.log(`📢 Notifying patients that ${userName} started consultation`);
        // Find all patient sockets and notify them
        Object.values(users).forEach(user => {
          if (user.role === 'PATIENT') {
            io.to(user.socketId).emit('consultationStarted', {
              doctorName: userName,
              doctorId: userId,
              timestamp: new Date()
            });
          }
        });
      }

      console.log(`✅ ${role} ${userName} successfully joined consultation room`);
    });

    socket.on('sendConsultationMessage', (data) => {
      const { message, senderId, senderName, senderRole } = data;
      console.log(`💬 ${senderRole} ${senderName}: ${message}`);

      // Broadcast to all in consultation room except sender
      socket.to('consultationRoom').emit('receiveConsultationMessage', {
        message,
        senderId,
        senderName,
        senderRole,
        timestamp: new Date()
      });

      console.log(`📤 Message sent to consultation room`);
    });

    socket.on('leaveConsultation', ({ userId, userName, role }) => {
      console.log(`👋 ${role} ${userName} leaving consultation room`);
      socket.leave('consultationRoom');
      socket.to('consultationRoom').emit('userLeftConsultation', {
        userId,
        userName,
        role,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', async () => {
      const userData = users[socket.id];
      if (userData) {
        // Handle user going offline
        if (userData.userRole === 'DOCTOR') {
          try {
            const appointments = await Appointment.find({
              doctorId: userData.userId,
              status: { $in: ['CONFIRMED', 'SCHEDULED'] }
            }).populate('patientId');

            appointments.forEach(appointment => {
              const patientSocket = Object.values(users).find(u => u.userId === appointment.patientId._id.toString());
              if (patientSocket) {
                io.to(patientSocket.socketId).emit('doctorStatusUpdate', {
                  doctorId: userData.userId,
                  isOnline: false
                });
              }
            });
          } catch (error) {
            console.error('Error updating doctor status:', error);
          }
        }

        if (userData.sessionId) {
          socket.to(userData.sessionId).emit('userDisconnected', { userId: userData.userId });
        }

        delete users[socket.id];
        console.log(`User ${userData.userId} disconnected`);
      }
    });
  });
};

// Helper function to check appointment-based access
async function checkAppointmentAccess(userId, userRole, sessionId) {
  try {
    // Extract doctor ID from session ID (format: patient-doctor-room-{doctorId})
    const doctorIdMatch = sessionId.match(/patient-doctor-room-([a-f0-9]+)/);
    if (!doctorIdMatch) return false;

    const doctorId = doctorIdMatch[1];

    // Check if there's an active appointment between this patient and doctor
    const appointment = await Appointment.findOne({
      $or: [
        { patientId: userId, doctorId: doctorId },
        { patientId: doctorId, doctorId: userId }
      ],
      status: { $in: ['CONFIRMED', 'SCHEDULED', 'COMPLETED'] }
    });

    return !!appointment;
  } catch (error) {
    console.error('Access check error:', error);
    return false;
  }
}

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { socketConnection, getIO };