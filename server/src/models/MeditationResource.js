const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeditationResourceSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  content: { type: String },
  type: { type: String, enum: ['VIDEO', 'ARTICLE', 'AUDIO', 'GUIDED_MEDITATION'], required: true },
  tags: [{ type: String, trim: true }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  indexes: [
    { type: 1 },
    { tags: 1 },
    { isPublic: 1 },
    { createdAt: 1 }
  ]
});

module.exports = mongoose.model('MeditationResource', MeditationResourceSchema);