const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Market', MarketSchema);