if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
const methodOverride = require('method-override')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))

const mongoose = require('mongoose')
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

//setting up routes
const indexRouter = require('./routes/index')
app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)