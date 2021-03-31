const express = require('express')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
//mongoose part
const Teacher = require('../models/teacher')


const initializePassport = require('./../passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

/*use database
const users =[]*/
const users =[]

/*const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser:true, useUnifiedTopology:true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose"))*/


//want to access forms within post method
app.use(flash())
app.use(session({
  //red check env file, make sure it's long string of letters to make it more secure
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

router.get('/', checkAuthenticated, (req, res) => {
  res.render('teachers/index', { name: req.user.name})
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('teachers/login')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: 'teachers/index',
  failureRedirect: 'teachers/login',
  failureFlash:true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('teachers/register')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      //automatically generated w/ database
      //id is timestamp
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('teachers/login')
    console.log(users)
  } catch {
    res.redirect('teachers/register')
  }
})

//signing out
router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('teachers/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('teachers/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('teachers/index')
  }

  next()
}



module.exports = router