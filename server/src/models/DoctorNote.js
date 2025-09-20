const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorNoteSchema = new Schema({
  doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  content: { type: String, required: true, trim: true },
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  indexes: [
    { doctorId: 1 },
    { patientId: 1 },
    { appointmentId: 1 },
    { createdAt: 1 }
  ]
});

module.exports = mongoose.model('DoctorNote', DoctorNoteSchema);