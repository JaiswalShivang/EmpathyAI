import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', { transports: ['websocket'] });

// Authentication and online status
export const authenticateUser = (userId, userRole) => {
  return new Promise((resolve, reject) => {
    socket.emit('authenticate', { userId, userRole });

    socket.once('authenticated', (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.message));
      }
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      reject(new Error('Authentication timeout'));
    }, 5000);
  });
};

// Session management
export const joinSession = (sessionId, userId, userRole) => {
  return new Promise((resolve, reject) => {
    socket.emit('joinSession', { sessionId, userId, userRole });

    const handleJoinError = (error) => {
      socket.off('joinError', handleJoinError);
      reject(new Error(error.message));
    };

    socket.once('joinError', handleJoinError);

    // Assume success if no error after 2 seconds
    setTimeout(() => {
      socket.off('joinError', handleJoinError);
      resolve();
    }, 2000);
  });
};

export const leaveSession = (sessionId, userId) => {
  socket.emit('leaveSession', { sessionId, userId });
};

export const sendMessage = (data) => {
  socket.emit('sendMessage', data);
};

export const sendDirectMessage = (data) => {
  socket.emit('sendDirectMessage', data);
};

export const sendTyping = (sessionId, userId, isTyping) => {
  socket.emit('typing', { sessionId, userId, isTyping });
};

// Video calling
export const sendVideoOffer = (sessionId, offer) => {
  socket.emit('videoOffer', { sessionId, offer });
};

export const sendVideoAnswer = (sessionId, answer) => {
  socket.emit('videoAnswer', { sessionId, answer });
};

export const sendIceCandidate = (sessionId, candidate) => {
  socket.emit('iceCandidate', { sessionId, candidate });
};

// Event listeners for real-time updates
export const onDoctorStatusUpdate = (callback) => {
  socket.on('doctorStatusUpdate', callback);
  return () => socket.off('doctorStatusUpdate', callback);
};

export const onUserJoined = (callback) => {
  socket.on('userJoined', callback);
  return () => socket.off('userJoined', callback);
};

export const onUserLeft = (callback) => {
  socket.on('userLeft', callback);
  return () => socket.off('userLeft', callback);
};

export const onUserDisconnected = (callback) => {
  socket.on('userDisconnected', callback);
  return () => socket.off('userDisconnected', callback);
};

export const onReceiveMessage = (callback) => {
  socket.on('receiveMessage', callback);
  return () => socket.off('receiveMessage', callback);
};

export const onReceiveDirectMessage = (callback) => {
  socket.on('receiveDirectMessage', callback);
  return () => socket.off('receiveDirectMessage', callback);
};

export const onUserTyping = (callback) => {
  socket.on('userTyping', callback);
  return () => socket.off('userTyping', callback);
};

// Video call events
export const startVideoCall = (roomId, callerId, callerName, receiverId) => {
  socket.emit('startVideoCall', { roomId, callerId, callerName, receiverId });
};

export const joinVideoCall = (roomId, userId, userName) => {
  socket.emit('joinVideoCall', { roomId, userId, userName });
};

export const endVideoCall = (roomId, userId) => {
  socket.emit('endVideoCall', { roomId, userId });
};

export const onVideoCallStarted = (callback) => {
  socket.on('videoCallStarted', callback);
  return () => socket.off('videoCallStarted', callback);
};

export const onVideoCallEnded = (callback) => {
  socket.on('videoCallEnded', callback);
  return () => socket.off('videoCallEnded', callback);
};

export const onVideoCallJoined = (callback) => {
  socket.on('videoCallJoined', callback);
  return () => socket.off('videoCallJoined', callback);
};

// Export getIO function for consistency
export const getIO = () => socket;

export default socket;
