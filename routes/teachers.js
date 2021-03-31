const express = require('express')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
//mongoose part
//const Teacher = require('../models/teacher')

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser:true, useUnifiedTopology:true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose"))

/*const teacherSchema = new mongoose.Schema({
  name: req.body.name,
  id: Date.now().toString(),
  email: req.body.email,
})*/
const teacherSchema = new mongoose.Schema({
  name: String,
  email: String,
  id: String,
  password: Number,
})

const Teacher = mongoose.model("Teacher", teacherSchema)


/*use database
const users =[]*/
const users =[]



const initializePassport = require('./../passport-config')
const { authorize } = require('passport')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)




module.exports = mongoose.model("Teacher", teacherSchema)


//want to access forms within post method
router.use(flash())
router.use(session({
  //red check env file, make sure it's long string of letters to make it more secure
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

router.get('/', checkAuthenticated, (req, res) => {
  res.render('teachers', { name: req.user.name})
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('teachers/login')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/teachers',
  failureRedirect: 'login',
  failureFlash:true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('teachers/register')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  /*const teacher = new Teacher({
    id:Date.now().toString(),
    name:req.body.name,
    email: req.body.email,
    password:hashedPassword
  })*/
  try {
    //const newTeacher = await teacher.save()
    users.push({
      //automatically generated w/ database
      //id is timestamp
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('login')
    console.log(teacher)
    /*Teacher.save(function (err) {
      if (err) return handleError(err);
    })*/
  } catch {
    res.redirect('register')
  }
})

//signing out
router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('teachers/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('teachers')
  }

  next()
}



module.exports = router