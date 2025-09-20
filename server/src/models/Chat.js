const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
  roomId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: function() { return this.senderRole !== 'AI'; } },
  senderRole: { type: String, enum: ['PATIENT','DOCTOR','ADMIN','AI'], required: true },
  message: { type: String, required: true },
  messageType: { type: String, enum: ['TEXT', 'SYSTEM', 'VIDEO_OFFER', 'VIDEO_ANSWER', 'VIDEO_ICE'], default: 'TEXT' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', ChatSchema);
