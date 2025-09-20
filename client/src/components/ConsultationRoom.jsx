import React, { useState, useEffect, useRef } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import io from 'socket.io-client';

const ConsultationRoom = ({ role }) => {
  const [zegoEngine, setZegoEngine] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoConnected, setIsVideoConnected] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [error, setError] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Generate unique user ID based on role and timestamp
  const userId = `${role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const userName = role === 'DOCTOR' ? 'Dr. Smith' : 'Patient';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Socket.io connection
  useEffect(() => {
    console.log('🔌 Connecting to Socket.io...');
    const socketConnection = io(API_URL);

    socketConnection.on('connect', () => {
      console.log('✅ Socket.io connected:', socketConnection.id);
      setIsSocketConnected(true);

      // Join consultation room
      socketConnection.emit('joinConsultation', {
        userId,
        userName,
        role
      });
      console.log(`📍 ${role} ${userName} joining consultation room`);
    });

    socketConnection.on('disconnect', () => {
      console.log('❌ Socket.io disconnected');
      setIsSocketConnected(false);
    });

    socketConnection.on('userJoinedConsultation', (data) => {
      console.log(`👋 User joined: ${data.role} ${data.userName}`);
      addMessage('system', `${data.role} ${data.userName} joined the consultation`);
    });

    socketConnection.on('userLeftConsultation', (data) => {
      console.log(`👋 User left: ${data.role} ${data.userName}`);
      addMessage('system', `${data.role} ${data.userName} left the consultation`);
    });

    socketConnection.on('receiveConsultationMessage', (data) => {
      console.log(`💬 Received message from ${data.senderRole} ${data.senderName}: ${data.message}`);
      addMessage('user', data.message, `${data.senderRole} ${data.senderName}`);
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Initialize Zego Engine
  useEffect(() => {
    initializeZegoEngine();
    return () => {
      if (zegoEngine) {
        zegoEngine.logoutRoom('consultationRoom');
        zegoEngine.destroyEngine();
      }
    };
  }, []);

  const initializeZegoEngine = async () => {
    try {
      console.log('🎥 Initializing Zego Engine...');

      // Get token from backend
      const tokenResponse = await fetch(`${API_URL}/api/consultation/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, role })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || 'Failed to get token');
      }

      const tokenData = await tokenResponse.json();
      console.log(`🔑 Token generated (length: ${tokenData.token.length}) for ${role}: ${userId}`);

      // Initialize Zego Engine
      const engine = new ZegoExpressEngine(tokenData.appId);

      // Disable logging to prevent console errors
      try {
        if (engine.setLogConfig) {
          engine.setLogConfig({ logLevel: 'none' });
        }
      } catch (logError) {
        console.log('Could not disable Zego logging');
      }

      setZegoEngine(engine);

      // Set up event listeners
      engine.on('roomStateUpdate', (roomId, state, errorCode, extendedData) => {
        console.log('🏠 Room state update:', state, 'Error:', errorCode);
        if (state === 'CONNECTED') {
          setIsConnected(true);
          console.log('✅ Successfully connected to Zego room');
          addMessage('system', 'Connected to video consultation room');
        } else if (state === 'DISCONNECTED') {
          setIsConnected(false);
          console.log('❌ Disconnected from Zego room');
          addMessage('system', 'Disconnected from video consultation room');
        } else if (state === 'CONNECTING') {
          console.log('🔄 Connecting to Zego room...');
        }
      });

      engine.on('roomUserUpdate', (roomId, updateType, userList) => {
        console.log('👥 Room user update:', updateType, userList);
        if (updateType === 'ADD' && userList.length > 0) {
          userList.forEach(user => {
            if (user.userID !== userId) {
              setRemoteUserId(user.userID);
              console.log(`🎥 Remote user joined: ${user.userID}`);
              addMessage('system', `${user.userName || 'Participant'} joined the video call`);
            }
          });
        } else if (updateType === 'DELETE') {
          setRemoteUserId(null);
          console.log('🎥 Remote user left');
          addMessage('system', 'Participant left the video call');
        }
      });

      engine.on('roomStreamUpdate', async (roomId, updateType, streamList, extendedData) => {
        console.log('📺 Room stream update:', updateType, streamList);

        if (updateType === 'ADD' && streamList.length > 0) {
          const streamID = streamList[0].streamID;
          console.log(`📥 Remote stream added: ${streamID}`);

          try {
            const remoteStream = await engine.startPlayingStream(streamID);
            console.log('▶️ Started playing remote stream');

            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              setIsVideoConnected(true);
              addMessage('system', 'Video connection established');
            }
          } catch (streamError) {
            console.error('❌ Failed to play remote stream:', streamError);
            addMessage('system', 'Failed to establish video connection');
          }
        } else if (updateType === 'DELETE') {
          console.log('📤 Remote stream removed');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
          setIsVideoConnected(false);
          addMessage('system', 'Video connection ended');
        }
      });

      // Login to room
      console.log(`🔐 Logging into Zego room with userId: ${userId}`);
      await engine.loginRoom('consultationRoom', tokenData.token, {
        userID: userId,
        userName: userName
      }, { userUpdate: true });

      // Create and start local stream
      console.log('📹 Creating local video stream...');
      const localStream = await engine.createStream({
        camera: {
          video: true,
          audio: true,
          videoQuality: 4, // HD quality
          facingMode: 'user'
        }
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        console.log('📹 Local video stream set');
      }

      // Ensure camera is enabled
      try {
        await engine.enableCamera(true);
        console.log('📹 Camera enabled successfully');
      } catch (cameraError) {
        console.warn('⚠️ Could not enable camera:', cameraError);
      }

      // Ensure microphone is enabled
      try {
        await engine.muteMicrophone(false);
        console.log('🎤 Microphone enabled successfully');
      } catch (micError) {
        console.warn('⚠️ Could not enable microphone:', micError);
      }

      // Start publishing stream
      const streamID = `${userId}_${Date.now()}`;
      console.log(`📤 Publishing stream: ${streamID}`);
      await engine.startPublishingStream(streamID, localStream);
      console.log('✅ Stream published successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Zego Engine:', error);
      setError(`Connection failed: ${error.message}`);
      addMessage('system', `Connection failed: ${error.message}`);
    }
  };

  const addMessage = (type, content, sender = '') => {
    const message = {
      id: Date.now() + Math.random(),
      type, // 'user', 'system'
      content,
      sender: sender || (type === 'system' ? 'System' : userName),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !isSocketConnected) return;

    console.log(`📤 Sending message: ${inputMessage}`);
    socket.emit('sendConsultationMessage', {
      message: inputMessage.trim(),
      senderId: userId,
      senderName: userName,
      senderRole: role
    });

    addMessage('user', inputMessage.trim(), `${role} ${userName}`);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMic = async () => {
    if (!zegoEngine) return;

    try {
      if (isMicOn) {
        await zegoEngine.muteMicrophone(true);
        console.log('🎤 Microphone muted');
      } else {
        await zegoEngine.muteMicrophone(false);
        console.log('🎤 Microphone unmuted');
      }
      setIsMicOn(!isMicOn);
    } catch (error) {
      console.error('Failed to toggle mic:', error);
    }
  };

  const toggleCamera = async () => {
    if (!zegoEngine) return;

    try {
      if (isCameraOn) {
        await zegoEngine.enableCamera(false);
        console.log('📹 Camera disabled');
      } else {
        await zegoEngine.enableCamera(true);
        console.log('📹 Camera enabled');
      }
      setIsCameraOn(!isCameraOn);
    } catch (error) {
      console.error('Failed to toggle camera:', error);
    }
  };

  const endCall = async () => {
    if (zegoEngine) {
      await zegoEngine.logoutRoom('consultationRoom');
      zegoEngine.destroyEngine();
    }
    if (socket) {
      socket.emit('leaveConsultation', { userId, userName, role });
      socket.disconnect();
    }
    window.location.reload(); // Simple way to reset
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {role} Consultation Room
          </h1>
          <div className="flex justify-center space-x-4 text-sm">
            <span className={`px-2 py-1 rounded ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
              Video: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            <span className={`px-2 py-1 rounded ${isSocketConnected ? 'bg-green-600' : 'bg-red-600'}`}>
              Chat: {isSocketConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            User ID: {userId} | Room: consultationRoom
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Video Consultation</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Local Video */}
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-48 bg-gray-700 rounded-lg object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    You ({isMicOn ? '🎤' : '🔇'})
                  </div>
                </div>

                {/* Remote Video */}
                <div className="relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-full h-48 bg-gray-700 rounded-lg object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {remoteUserId ? `${role === 'DOCTOR' ? 'Patient' : 'Doctor'} (${remoteUserId})` : 'Waiting for participant...'}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleMic}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isMicOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isMicOn ? '🎤 Mute' : '🔇 Unmute'}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isCameraOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {isCameraOn ? '📹 Turn Off Camera' : '📷 Turn On Camera'}
                </button>

                <button
                  onClick={endCall}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  📞 End Call
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Chat Messages</h2>

            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-4 p-2 bg-gray-700 rounded">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-2 rounded text-sm ${
                        message.type === 'system'
                          ? 'bg-gray-600 text-center text-gray-300'
                          : message.sender.includes(role)
                          ? 'bg-blue-600 ml-8'
                          : 'bg-gray-600 mr-8'
                      }`}
                    >
                      {message.type === 'user' && (
                        <div className="font-semibold text-xs mb-1">{message.sender}</div>
                      )}
                      <div>{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={!isSocketConnected}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !isSocketConnected}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded font-semibold transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;