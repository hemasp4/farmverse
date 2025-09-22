const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  coins: {
    type: Number,
    default: 500,
  },
  land: {
    type: Number,
    default: 4,
  },
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  panchayat: {
    type: String,
    default: null, // Or some default panchayat
  },
});

module.exports = mongoose.model('User', UserSchema);