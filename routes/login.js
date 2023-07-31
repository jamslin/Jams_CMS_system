const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('login/index', {title:"login", error: null});
});

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    req.session.userId = user._id;
    res.redirect('/dashboard'); // Redirect to the authenticated user's dashboard
  } catch (error) {
    res.render('login', { error: 'Error logging in. Please try again.' });
  }
});

module.exports = router;
