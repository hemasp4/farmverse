const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Crop = require('../models/Crop');
const User = require('../models/User');

// @route   POST api/crops
// @desc    Plant a new crop
// @access  Private
router.post('/', auth, async (req, res) => {
  const { cropType, position, cropCatalog } = req.body;

  try {
    // 1. Fetch the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // 2. Get crop cost
    const cropCost = cropCatalog[cropType].cost;

    // 3. Check affordability
    if (user.coins < cropCost) {
      return res.status(400).json({ msg: 'Not enough coins to plant this crop' });
    }

    // 4. Deduct coins
    user.coins -= cropCost;

    // 5. Save user
    await user.save();

    const plantedAt = new Date();
    const growthTime = cropCatalog[cropType].growthTime;
    const harvestTime = new Date(plantedAt.getTime() + growthTime);

    const newCrop = new Crop({
      user: req.user.id,
      type: cropType,
      plantedAt,
      harvestTime,
      position,
      stage: 'seedling',
    });

    const crop = await newCrop.save();

    // 6. Return updated user data along with the new crop
    res.json({ crop, user }); // Return both crop and updated user
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/crops
// @desc    Get user's crops
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const crops = await Crop.find({ user: req.user.id });
    res.json(crops);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/crops/harvest
// @desc    Harvest a crop
// @access  Private
router.post('/harvest', auth, async (req, res) => {
  const { cropId, marketPrices, cropCatalog } = req.body;

  try {
    const crop = await Crop.findById(cropId);

    if (!crop) {
      return res.status(404).json({ msg: 'Crop not found' });
    }

    if (crop.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    if (new Date() < crop.harvestTime) {
      return res.status(400).json({ msg: 'Crop not ready for harvest' });
    }

    const cropType = crop.type;
    const marketPrice = marketPrices[cropType] || cropCatalog[cropType].baseValue;

    const user = await User.findById(req.user.id);
    user.coins += marketPrice;
    user.experience += 10;
    await user.save();

    await Crop.findByIdAndDelete(cropId);

    res.json({ msg: 'Crop harvested successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;