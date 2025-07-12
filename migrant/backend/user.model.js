const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  identifier: { type: String, required: true, unique: true }, // email or phone
  password: { type: String, required: true },
  language: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 