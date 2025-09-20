
# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)

# ZegoCloud + Socket.io Video Consultation Setup

This is a complete working example of doctor-patient video consultation using ZegoCloud for video/audio and Socket.io for real-time messaging.

## Features

- ✅ **ZegoCloud Video/Audio**: Real-time video calling between doctor and patient
- ✅ **Socket.io Messaging**: Real-time text chat during consultation
- ✅ **Token Generation**: Secure JWT token generation for ZegoCloud authentication
- ✅ **Room Management**: Both users join the same "consultationRoom"
- ✅ **Connection Monitoring**: Detailed console logs for debugging
- ✅ **Error Handling**: Comprehensive error handling for connection failures
- ✅ **Role-based UI**: Different interfaces for Doctor and Patient roles

## Setup Instructions

### 1. Environment Variables

Create/update `server/.env`:

```env
# ZegoCloud Credentials
ZEGO_APP_ID=YOUR_ZEGO_APP_ID
ZEGO_SERVER_SECRET=YOUR_ZEGO_SERVER_SECRET

# Other existing variables...
```

**Replace with your actual ZegoCloud credentials from the ZegoCloud Console.**

### 2. Install Dependencies

```bash
# Backend
cd server
npm install crypto-js  # Already added to package.json

# Frontend (zego-express-engine-webrtc should already be installed)
cd ../client
npm install socket.io-client
```

### 3. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd ../client
npm run dev
```

### 4. Access the Consultation

1. Open `http://localhost:5173/consultation`
2. Open the same URL in a second browser tab
3. In first tab: Select "Doctor" role
4. In second tab: Select "Patient" role
5. Click "Start Video Consultation" in both tabs
6. Allow camera/microphone permissions
7. You should see both video streams and real-time chat

## Code Structure

### Backend Files

#### `server/src/server.js` - Main Server
```javascript
// Added consultation token endpoint
app.post('/api/consultation/token', (req, res) => {
  // Token generation logic
});
```

#### `server/src/utils/zegoToken.js` - Token Generation
```javascript
function generateZegoToken(appId, serverSecret, userId, effectiveTimeInSeconds = 3600, payload = '') {
  // JWT token generation for ZegoCloud
}
```

#### `server/src/utils/socket.js` - Socket.io Events
```javascript
// Added consultation room events
socket.on('joinConsultation', ({ userId, userName, role }) => {
  // Join consultation room logic
});

socket.on('sendConsultationMessage', (data) => {
  // Message broadcasting logic
});
```

### Frontend Files

#### `client/src/components/ConsultationRoom.jsx` - Main Consultation Component
- ZegoCloud video initialization
- Socket.io chat integration
- Video controls (mic/camera toggle)
- Real-time messaging UI

#### `client/src/pages/ConsultationSetup.jsx` - Role Selection Page
- Choose Doctor or Patient role
- Setup instructions

#### `client/src/App.jsx` - Routing
```javascript
<Route path="/consultation" element={<ConsultationSetup />} />
```

## API Endpoints

### POST `/api/consultation/token`

**Request:**
```json
{
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "token": "zego_jwt_token_here",
  "appId": 123456789,
  "serverSecret": "your_server_secret",
  "userId": "doctor_1234567890_abc123",
  "userName": "Dr. Smith",
  "roomId": "consultationRoom",
  "role": "DOCTOR"
}
```

## Socket.io Events

### Client → Server

#### `joinConsultation`
```javascript
socket.emit('joinConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

#### `sendConsultationMessage`
```javascript
socket.emit('sendConsultationMessage', {
  message: "Hello, how are you feeling today?",
  senderId: "doctor_1234567890_abc123",
  senderName: "Dr. Smith",
  senderRole: "DOCTOR"
});
```

#### `leaveConsultation`
```javascript
socket.emit('leaveConsultation', {
  userId: "doctor_1234567890_abc123",
  userName: "Dr. Smith",
  role: "DOCTOR"
});
```

### Server → Client

#### `userJoinedConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:30:00.000Z"
}
```

#### `userLeftConsultation`
```javascript
{
  userId: "patient_1234567890_def456",
  userName: "Patient",
  role: "PATIENT",
  timestamp: "2025-01-20T10:45:00.000Z"
}
```

#### `receiveConsultationMessage`
```javascript
{
  message: "I'm feeling much better, thank you doctor!",
  senderId: "patient_1234567890_def456",
  senderName: "Patient",
  senderRole: "PATIENT",
  timestamp: "2025-01-20T10:32:00.000Z"
}
```

## Console Debug Logs

The application provides detailed console logging for debugging:

### Backend Logs
```
🔑 Generated consultation token for DOCTOR: doctor_1234567890_abc123 (token length: 312)
