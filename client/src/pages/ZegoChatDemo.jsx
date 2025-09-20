import React, { useState } from 'react';
import ZegoChat from '../components/ZegoChat';

export default function ZegoChatDemo() {
  const [user1Id, setUser1Id] = useState('user1');
  const [user1Name, setUser1Name] = useState('Alice');
  const [user2Id, setUser2Id] = useState('user2');
  const [user2Name, setUser2Name] = useState('Bob');
  const [roomId, setRoomId] = useState('zego_chat_demo');
  const [showChat, setShowChat] = useState(false);

  const startChat = () => {
    if (user1Id && user1Name && user2Id && user2Name && roomId) {
      setShowChat(true);
    }
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ZegoCloud Real-time Chat Demo</h1>
            <p className="text-gray-600">Two users chatting in real-time using ZegoExpressEngine</p>
            <button
              onClick={() => setShowChat(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Setup
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User 1 Chat */}
            <div>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold text-blue-800">User 1: {user1Name}</h2>
                <p className="text-sm text-blue-600">ID: {user1Id}</p>
              </div>
              <ZegoChat userId={user1Id} userName={user1Name} roomId={roomId} />
            </div>

            {/* User 2 Chat */}
            <div>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-semibold text-green-800">User 2: {user2Name}</h2>
                <p className="text-sm text-green-600">ID: {user2Id}</p>
              </div>
              <ZegoChat userId={user2Id} userName={user2Name} roomId={roomId} />
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Test:</h3>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Open this page in two separate browser tabs/windows</li>
              <li>Use different user IDs and names for each tab</li>
              <li>Send messages from one tab and see them appear in the other tab instantly</li>
              <li>Notice the connection status indicators and user join/leave messages</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ZegoCloud Chat Setup</h1>
          <p className="text-gray-600">Configure two users for real-time chat demo</p>
        </div>

        <div className="space-y-6">
          {/* Room Configuration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* User 1 Configuration */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">User 1</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">User ID</label>
                <input
                  type="text"
                  value={user1Id}
                  onChange={(e) => setUser1Id(e.target.value)}
                  placeholder="user1"
                  className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={user1Name}
                  onChange={(e) => setUser1Name(e.target.value)}
                  placeholder="Alice"
                  className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* User 2 Configuration */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">User 2</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">User ID</label>
                <input
                  type="text"
                  value={user2Id}
                  onChange={(e) => setUser2Id(e.target.value)}
                  placeholder="user2"
                  className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={user2Name}
                  onChange={(e) => setUser2Name(e.target.value)}
                  placeholder="Bob"
                  className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            onClick={startChat}
            disabled={!user1Id || !user1Name || !user2Id || !user2Name || !roomId}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-lg"
          >
            Start Real-time Chat Demo
          </button>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Configure your ZegoCloud credentials in server/.env</li>
            <li>2. Set ZEGO_APP_ID and ZEGO_SERVER_SECRET</li>
            <li>3. Start the server: cd server && npm start</li>
            <li>4. Open this demo in two browser tabs</li>
            <li>5. Use different user IDs for each tab</li>
          </ol>
        </div>
      </div>
    </div>
  );
}