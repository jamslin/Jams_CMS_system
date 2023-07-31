const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('register/index', {title:"register", error: null});
});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.render('register', { error: 'Username or email already exists.' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    res.render('register', { error: 'Error registering user. Please try again.' });
  }
});

module.exports = router;
