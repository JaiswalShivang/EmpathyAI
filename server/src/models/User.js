const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['PATIENT','DOCTOR','ADMIN'], default: 'PATIENT' },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  // Doctor-specific fields
  doctorProfile: {
    specialization: [{ type: String, trim: true }],
    experience: { type: Number, min: 0 }, // years of experience
    qualifications: [{ type: String, trim: true }], // degrees, certifications
    licenseNumber: { type: String, trim: true },
    hospital: { type: String, trim: true },
    clinic: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },
    consultationFee: { type: Number, min: 0 },
    languages: [{ type: String, trim: true }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, min: 0, default: 0 },
    availability: {
      monday: { start: String, end: String, available: { type: Boolean, default: true } },
      tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
      wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
      thursday: { start: String, end: String, available: { type: Boolean, default: true } },
      friday: { start: String, end: String, available: { type: Boolean, default: true } },
      saturday: { start: String, end: String, available: { type: Boolean, default: false } },
      sunday: { start: String, end: String, available: { type: Boolean, default: false } }
    }
  }
});
module.exports = mongoose.model('User', UserSchema);
