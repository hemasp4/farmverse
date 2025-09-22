const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('Registration: User already exists for email:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('Registration: Attempting to save new user:', user.email);
    await user.save();
    console.log('Registration: User saved successfully:', user.email);

    const payload = {
      user: {
        id: user.id,
        coins: user.coins,
        land: user.land,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login: Attempting to find user by email:', email);
    let user = await User.findOne({ email });
    if (!user) {
      console.log('Login: User not found for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('Login: User found:', user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login: Password mismatch for user:', user.email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    console.log('Login: Password matched for user:', user.email);

    const payload = {
      user: {
        id: user.id,
        coins: user.coins,
        land: user.land,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;