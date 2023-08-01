const express = require('express');
const router = express.Router();
const session = require('express-session');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Define the authentication middleware function
router.use(
  session({
    secret: 'secret_key',
    resave: true,
    saveUninitialized: true,
  })
);
const authenticateUser = (req, res, next) => {
if (req.session.userId) {
    // User is authenticated, continue to the next middleware or route handler
    next();
} else {
    // User is not authenticated, redirect to the login page
    console.log("failed");
    res.redirect('/dashboard/login');
}
}


// Use the authentication middleware for routes that require authentication
router.get('/', authenticateUser, (req, res) => {
    // Render the dashboard page for authenticated users
    res.render('dashboard', { title: "Dashboard", user: req.session.userId });
})


 router
    .route('/login')
    .get((req, res) => {
        res.render('dashboard/login', {title:"Login", error: null});
    })
    .post(async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
        return res.render('dashboard/login', {title: "Login", error: 'Invalid username or password.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
        return res.render('dashboard/login', {title: "Login", error: 'Invalid username or password.' });
        }

        req.session.userId = user._id;
        res.redirect('dashboard'); // Redirect to the authenticated user's dashboard
    } catch (error) {
        res.render('dashboard/login', {title: "Login", error: 'Error logging in. Please try again.' });
    }
    })
/*
router
    .route("/register")
    .get('/', (req, res) => {
        res.render('dashboard/register', {title:"register", error: null});
      })
    .post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    
        if (existingUser) {
        return res.render('dashboard/register', { title: 'register', error: 'Username or email already exists.' });
        }
    
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.redirect('dashboard/login');
    } catch (error) {
        res.render('dashboard/register', { title: 'register' , error: 'Error registering user. Please try again.' });
    }
    })

    
router
.route("/logout")
.get('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.redirect('dashboard');
  });
}); */

module.exports = router