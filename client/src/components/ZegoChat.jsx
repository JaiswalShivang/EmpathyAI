import React, { useState, useEffect, useRef } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const ZegoChat = ({ userId, userName, roomId = 'zego_chat_room' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [zegoEngine, setZegoEngine] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Zego Engine
  useEffect(() => {
    initializeZegoChat();
    return () => {
      if (zegoEngine) {
        zegoEngine.logoutRoom(roomId);
        zegoEngine.destroyEngine();
      }
    };
  }, []);

  const initializeZegoChat = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get token from backend
      const tokenResponse = await fetch(`${API_URL}/api/zego/generate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, roomId })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || 'Failed to get token');
      }

      const tokenData = await tokenResponse.json();

      // Initialize Zego Engine
      const engine = new ZegoExpressEngine(tokenData.appId, tokenData.serverSecret || 'YOUR_SERVER_SECRET');

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
        console.log('Room state update:', state);
        if (state === 'CONNECTED') {
          setIsConnected(true);
          addMessage('system', 'Connected to chat room');
        } else if (state === 'DISCONNECTED') {
          setIsConnected(false);
          addMessage('system', 'Disconnected from chat room');
        } else if (state === 'CONNECTING') {
          addMessage('system', 'Connecting to chat room...');
        }
      });

      engine.on('roomUserUpdate', (roomId, updateType, userList) => {
        console.log('Room user update:', updateType, userList);
        if (updateType === 'ADD') {
          userList.forEach(user => {
            if (user.userID !== userId) {
              addMessage('system', `${user.userName || user.userID} joined the chat`);
            }
          });
        } else if (updateType === 'DELETE') {
          userList.forEach(user => {
            addMessage('system', `${user.userName || user.userID} left the chat`);
          });
        }
      });

      engine.on('IMRecvBroadcastMessage', (roomId, messageList) => {
        console.log('Received broadcast messages:', messageList);
        messageList.forEach(message => {
          addMessage('user', message.message, message.fromUser.userName || message.fromUser.userID);
        });
      });

      engine.on('IMRecvCustomCommand', (roomId, fromUser, command) => {
        console.log('Received custom command:', command);
      });

      // Login to room
      await engine.loginRoom(roomId, tokenData.token, {
        userID: userId,
        userName: userName
      }, { userUpdate: true });

      addMessage('system', `Welcome ${userName}! You are connected to the chat.`);

    } catch (error) {
      console.error('Failed to initialize Zego chat:', error);
      setError(`Connection failed: ${error.message}`);
      addMessage('system', `Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
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

  const sendMessage = async () => {
    if (!inputMessage.trim() || !zegoEngine || !isConnected) return;

    try {
      await zegoEngine.sendBroadcastMessage(roomId, inputMessage.trim());
      addMessage('user', inputMessage.trim(), userName);
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage('system', 'Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Zego Real-time Chat</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Room: {roomId} | User: {userName} ({userId})
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="h-96 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '400px' }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {isLoading ? 'Connecting...' : 'No messages yet. Start the conversation!'}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' && message.sender === userName ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'system'
                    ? 'bg-gray-100 text-gray-600 text-center'
                    : message.sender === userName
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.type === 'user' && message.sender !== userName && (
                  <div className="text-xs font-semibold mb-1">{message.sender}</div>
                )}
                <div className="text-sm">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected || isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !isConnected || isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • {messages.length} messages in chat
        </p>
      </div>
    </div>
  );
};

export default ZegoChat;