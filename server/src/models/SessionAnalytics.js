const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionAnalyticsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionType: { type: String, enum: ['CHAT', 'APPOINTMENT', 'MEDITATION_VIEW', 'RESOURCE_ACCESS'], required: true },
  duration: { type: Number },
  resourceId: { type: Schema.Types.ObjectId },
  date: { type: Date, default: Date.now },
  metadata: { type: Map, of: String }
}, {
  indexes: [
    { userId: 1 },
    { sessionType: 1 },
    { date: 1 }
  ]
});

module.exports = mongoose.model('SessionAnalytics', SessionAnalyticsSchema);