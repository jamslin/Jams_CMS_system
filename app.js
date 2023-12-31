if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express()

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(
  session({
    secret: 'secret_key',
    resave: true,
    saveUninitialized: true,
  })
);
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const cluster = process.env.DB_CLUSTER
const dbname = process.env.DB_NAME
const mongoDBURL = `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`
console.log(mongoDBURL)
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'secret_key',
    resave: true,
    saveUninitialized: true,
  })
);

// Define the authentication middleware function
const authenticateUser = (req, res, next) => {
  if (req.session.userId) {
    // User is authenticated, continue to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
};

// Use the authentication middleware for routes that require authentication
app.get('/dashboard', authenticateUser, (req, res) => {
  // Render the dashboard page for authenticated users
  res.render('dashboard', { user: req.session.userId });
});

//setting up routes
const indexRouter = require('./routes/indexRouter')
app.use('/', indexRouter)
const loginRouter = require('./routes/login')
app.use('/login', loginRouter)
const registerRouter = require('./routes/register')
app.use('/register', registerRouter)

app.listen(process.env.PORT || 3000)

