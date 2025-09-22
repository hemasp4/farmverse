const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET api/leaderboard
// @desc    Get top 100 users by experience
// @access  Public
router.get('/', async (req, res) => {
  const { panchayat } = req.query;
  const query = {};

  if (panchayat) {
    query.panchayat = panchayat;
  }

  try {
    const users = await User.find(query)
      .sort({ experience: -1 })
      .limit(100)
      .select('username experience level');

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      farmName: `${user.username}'s Farm`, // Placeholder for farm name
      experience: user.experience,
      level: user.level,
      uid: user._id, // For React key
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
