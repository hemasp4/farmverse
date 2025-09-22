const express = require('express');
const router = express.Router();
const Market = require('../models/Market');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// @route   GET api/market
// @desc    Get all market prices
// @access  Public
router.get('/', async (req, res) => {
  try {
    const prices = await Market.find();
    res.json(prices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/market/sell
// @desc    Sell a crop
// @access  Private
router.post('/sell', auth, async (req, res) => {
  const { cropType, quantity } = req.body;

  try {
    const marketPrice = await Market.findOne({ cropName: cropType });
    if (!marketPrice) {
      return res.status(400).json({ msg: 'Crop not found in market' });
    }

    const price = marketPrice.price;
    const totalEarnings = price * quantity;

    const newTransaction = new Transaction({
      user: req.user.id,
      cropType,
      quantity,
      pricePerUnit: price,
      totalEarnings,
      type: 'sell',
    });

    const transaction = await newTransaction.save();

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;