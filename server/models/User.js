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
});

module.exports = mongoose.model('User', UserSchema);