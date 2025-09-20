const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Made optional for quick bookings
  scheduledDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Scheduled date must be today or in the future'
    }
  },
  scheduledTime: { type: String, required: true },
  duration: {
    type: Number,
    default: 60,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Duration must be greater than 0'
    }
  },
  status: { type: String, enum: ['PENDING', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'], default: 'SCHEDULED' },
  notes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  indexes: [
    { patientId: 1 },
    { doctorId: 1 },
    { scheduledDate: 1 },
    { status: 1 },
    { patientId: 1, scheduledDate: 1 }
  ]
});

// Custom validation to ensure patientId != doctorId (only if doctorId exists)
AppointmentSchema.pre('validate', function(next) {
  if (this.patientId && this.doctorId && this.patientId.equals(this.doctorId)) {
    this.invalidate('doctorId', 'Patient and doctor cannot be the same user');
  }
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);