const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
  },
  plantedAt: {
    type: Date,
    default: Date.now,
  },
  harvestTime: {
    type: Date,
    required: true,
  },
  position: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  stage: {
    type: String,
    default: 'seedling',
  },
  isHarvestable: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Crop', CropSchema);