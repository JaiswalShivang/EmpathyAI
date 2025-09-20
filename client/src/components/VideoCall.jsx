import React, { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const VideoCall = ({ roomId, userId, userName, onEndCall, isDoctor = false }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [zegoEngine, setZegoEngine] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // ZegoCloud configuration
  const appID = 461444031;
  const serverSecret = '28390747711be586d315a64a67fbae81';

  // Alternative configuration for testing
  const testConfig = {
    appID: 461444031,
    serverSecret: '28390747711be586d315a64a67fbae81',
    // Use environment variables if available
    envAppID: import.meta.env?.VITE_ZEGO_APP_ID,
    envServerSecret: import.meta.env?.VITE_ZEGO_SERVER_SECRET
  };

  useEffect(() => {
    // Request camera and microphone permissions
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        console.log('Camera and microphone permissions granted');
      } catch (error) {
        console.error('Failed to get camera/microphone permissions:', error);
        alert('Camera and microphone permissions are required for video calls. Please allow access and refresh the page.');
      }
    };

    requestPermissions();

    // Suppress Zego WebSocket logging errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('weblogger-wss') || args[0].includes('WebSocket connection'))) {
        return; // Suppress Zego logging WebSocket errors
      }
      originalConsoleError.apply(console, args);
    };

    initializeZegoEngine();

    return () => {
      console.error = originalConsoleError; // Restore original console.error

      // Cleanup both Zego engine and fallback streams safely
      const cleanupEngine = async () => {
        try {
          // Clean up Zego engine if it exists
          if (zegoEngine && typeof zegoEngine.logoutRoom === 'function') {
            await zegoEngine.logoutRoom(roomId);
            console.log('Cleanup: Successfully logged out of room');
          }

          if (zegoEngine && typeof zegoEngine.destroyEngine === 'function') {
            zegoEngine.destroyEngine();
            console.log('Cleanup: Successfully destroyed Zego engine');
          }

          // Clean up fallback mode streams
          if (window.localStream) {
            window.localStream.getTracks().forEach(track => {
              track.stop();
              console.log('Cleanup: Stopped local media track:', track.kind);
            });
            window.localStream = null;
          }

          // Clear video elements
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
          }
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }

        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      };

      cleanupEngine();
    };
  }, []);

  // Ensure video elements are properly initialized
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.playsInline = true;
      localVideoRef.current.muted = true; // Local video should be muted to prevent feedback
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.playsInline = true;
    }
  }, []);

  const initializeZegoEngine = async () => {
    try {
      // Use environment variables if available, otherwise use hardcoded values
      const finalAppID = testConfig.envAppID || appID;
      const finalServerSecret = testConfig.envServerSecret || serverSecret;

      console.log('Initializing ZegoEngine with AppID:', finalAppID);

      // Create ZegoExpressEngine instance with error handling
      let engine;
      try {
        engine = new ZegoExpressEngine(finalAppID, finalServerSecret);
      } catch (engineError) {
        console.error('Failed to create Zego engine:', engineError);
        throw new Error('Zego engine creation failed');
      }

      // Disable Zego logging to prevent WebSocket connection errors
      try {
        if (engine.setLogConfig) {
          engine.setLogConfig({ logLevel: 'none' });
        } else if (engine.config) {
          engine.config({ logLevel: 'none' });
        } else if (engine.setDebugVerbose) {
          engine.setDebugVerbose(false);
        }
      } catch (logError) {
        console.log('Could not disable Zego logging:', logError.message);
      }

      setZegoEngine(engine);

      // Set up event listeners with error handling
      try {
        engine.on('roomStateUpdate', (roomId, state, errorCode, extendedData) => {
          console.log('Room state update:', state);
          if (state === 'DISCONNECTED') {
            setIsJoined(false);
            setRemoteUserId(null);
          }
        });

        engine.on('roomUserUpdate', (roomId, updateType, userList) => {
          console.log('Room user update:', updateType, userList);
          if (updateType === 'ADD' && userList.length > 0) {
            setRemoteUserId(userList[0].userID);
          } else if (updateType === 'DELETE') {
            setRemoteUserId(null);
          }
        });

        engine.on('roomStreamUpdate', async (roomId, updateType, streamList, extendedData) => {
          console.log('Room stream update:', updateType, streamList);

          if (updateType === 'ADD' && streamList.length > 0) {
            try {
              const streamID = streamList[0].streamID;
              const remoteStream = await engine.startPlayingStream(streamID);

              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            } catch (streamError) {
              console.error('Failed to play remote stream:', streamError);
            }
          } else if (updateType === 'DELETE') {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
          }
        });
      } catch (eventError) {
        console.error('Failed to set up event listeners:', eventError);
      }

      // Join room
      await joinRoom(engine);

    } catch (error) {
      console.error('Failed to initialize ZegoEngine:', error);
      console.log('Falling back to basic video call mode (no ZegoCloud)');

      // Set a flag to indicate ZegoCloud is not available
      setZegoEngine(null);
      setIsJoined(true); // Allow basic functionality
    }
  };

  const joinRoom = async (engine) => {
    if (!engine) {
      // Fallback mode without ZegoCloud
      console.log('Joining room in fallback mode (no ZegoCloud)');
      await initializeFallbackMode();
      return;
    }

    try {
      console.log('Attempting to join Zego room...');
      const token = generateToken(userId, 0, 3600); // Generate token for 1 hour

      // Add timeout and error handling for loginRoom
      const loginPromise = engine.loginRoom(roomId, token, {
        userID: userId,
        userName: userName
      }, { userUpdate: true });

      // Set a timeout for the login operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout')), 10000);
      });

      await Promise.race([loginPromise, timeoutPromise]);

      console.log('Successfully joined Zego room');
      setIsJoined(true);

      // Create and start local stream
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
        console.log('Local video stream set successfully');
      }

      // Ensure camera is enabled after creating stream
      try {
        if (typeof engine.enableCamera === 'function') {
          await engine.enableCamera(true);
          console.log('Camera enabled successfully');
          setIsCameraOn(true);
        } else {
          console.warn('enableCamera method not available, using fallback');
          setIsCameraOn(true);
        }
      } catch (cameraError) {
        console.error('Failed to enable camera:', cameraError);
        setIsCameraOn(false);
      }

      // Start publishing stream
      const streamID = `${userId}_${Date.now()}`;
      await engine.startPublishingStream(streamID, localStream);
      console.log('Stream publishing started');

    } catch (error) {
      console.error('Failed to join Zego room:', error);
      console.log('Falling back to basic video mode due to Zego error');

      // Clear the Zego engine reference to prevent further errors
      setZegoEngine(null);

      // Initialize fallback mode
      await initializeFallbackMode();
    }
  };

  const initializeFallbackMode = async () => {
    console.log('Initializing fallback video mode...');
    setIsJoined(true);

    try {
      // Get local media stream using native WebRTC
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      };

      const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        console.log('Fallback: Local video stream set successfully');
      }

      // Store stream reference for cleanup
      window.localStream = localStream;

    } catch (mediaError) {
      console.error('Fallback: Failed to get local media:', mediaError);
      alert('Unable to access camera/microphone. Please check permissions and try again.');
    }
  };

  const generateToken = (userId, effectiveTimeInSeconds, expireTime) => {
    // For development purposes, we'll use a simple token generation
    // In production, you should generate tokens on your server
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = {
      app_id: appID,
      user_id: userId,
      nonce: Math.random().toString(36).substring(2),
      ctime: timestamp,
      expire: timestamp + expireTime,
      payload: ''
    };

    // Simple base64 encoding for development
    return btoa(JSON.stringify(payload));
  };

  const toggleMic = async () => {
    const newMicState = !isMicOn;

    if (!zegoEngine) {
      // Fallback mode - control native WebRTC tracks
      if (window.localStream) {
        const audioTracks = window.localStream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = newMicState;
          console.log(`Fallback: Audio track ${newMicState ? 'enabled' : 'disabled'}`);
        });
      }
      setIsMicOn(newMicState);
      return;
    }

    try {
      if (typeof zegoEngine.muteMicrophone !== 'function') {
        console.warn('muteMicrophone method not available');
        setIsMicOn(newMicState);
        return;
      }

      if (isMicOn) {
        await zegoEngine.muteMicrophone(true);
      } else {
        await zegoEngine.muteMicrophone(false);
      }
      setIsMicOn(newMicState);
    } catch (error) {
      console.error('Failed to toggle mic:', error);
      // Fallback - just update UI state
      setIsMicOn(newMicState);
    }
  };

  const toggleCamera = async () => {
    const newCameraState = !isCameraOn;

    if (!zegoEngine) {
      // Fallback mode - control native WebRTC tracks
      if (window.localStream) {
        const videoTracks = window.localStream.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = newCameraState;
          console.log(`Fallback: Video track ${newCameraState ? 'enabled' : 'disabled'}`);
        });
      }
      setIsCameraOn(newCameraState);
      return;
    }

    try {
      console.log('Toggling camera to:', newCameraState);

      // Try different methods that might be available
      if (typeof zegoEngine.enableCamera === 'function') {
        await zegoEngine.enableCamera(newCameraState);
        console.log('Camera toggled using enableCamera');
      } else if (typeof zegoEngine.muteVideo === 'function') {
        await zegoEngine.muteVideo(!newCameraState);
        console.log('Camera toggled using muteVideo');
      } else if (typeof zegoEngine.enableVideo === 'function') {
        await zegoEngine.enableVideo(newCameraState);
        console.log('Camera toggled using enableVideo');
      } else {
        console.warn('No camera control method available on Zego engine');
        // Fallback - just update UI state
        setIsCameraOn(newCameraState);
        return;
      }

      setIsCameraOn(newCameraState);
    } catch (error) {
      console.error('Failed to toggle camera:', error);
      // Fallback - just update UI state
      setIsCameraOn(newCameraState);
    }
  };

  const endCall = async () => {
    try {
      // Clean up Zego engine if it exists
      if (zegoEngine && typeof zegoEngine.logoutRoom === 'function') {
        await zegoEngine.logoutRoom(roomId);
        console.log('Successfully logged out of room');
      }

      if (zegoEngine && typeof zegoEngine.destroyEngine === 'function') {
        zegoEngine.destroyEngine();
        console.log('Successfully destroyed Zego engine');
      }

      // Clean up fallback mode streams
      if (window.localStream) {
        window.localStream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped local media track:', track.kind);
        });
        window.localStream = null;
      }

      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

    } catch (error) {
      console.error('Error during call cleanup:', error);
      // Continue with onEndCall even if cleanup fails
    }

    // Always call onEndCall to close the modal
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Video Call {isDoctor ? '(Doctor)' : '(Patient)'}
            </h2>
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
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
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {remoteUserId ? `${isDoctor ? 'Patient' : 'Doctor'} (${remoteUserId})` : 'Waiting for participant...'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={toggleMic}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isMicOn
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isMicOn ? '🔊 Mute' : '🔇 Unmute'}
            </button>

            <button
              onClick={toggleCamera}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isCameraOn
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {isCameraOn ? '📹 Turn Off Camera' : '📷 Turn On Camera'}
            </button>

            <button
              onClick={endCall}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              📞 End Call
            </button>
          </div>

          {/* Status */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              {isJoined ? (
                zegoEngine ? 'Connected to video call (Zego)' : 'Connected to video call (Local)'
              ) : 'Connecting...'}
            </p>
            {!zegoEngine && isJoined && (
              <p className="text-blue-600 text-sm">
                Using local video mode - remote participant will need to join separately
              </p>
            )}
            {remoteUserId && (
              <p className="text-green-600 font-semibold">
                {isDoctor ? 'Patient' : 'Doctor'} has joined the call
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;