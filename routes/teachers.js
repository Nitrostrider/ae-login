const express = require('express')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passportLocalMongoose = require('passport-local-mongoose')
//mongoose part, maybe add later onto seperate file?
const Teacher = require('../models/teacher')
const initializePassport = require('./../passport-config')

const mongoose = require("mongoose")

/*const teacherSchema = new mongoose.Schema({
  name: req.body.name,
  id: Date.now().toString(),
  email: req.body.email,
})*/
/*const teacherSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  email: { type: String },
  //green probably not necessary, use _id instead
  //id: String,
  password: { type: String },
  __v: false,
})

const Teacher = mongoose.model("Teacher", teacherSchema)*/


/*use database
const users =[]*/
const users = []



//want to access forms within post method
router.use(flash())
router.use(session({
  //red check env file, make sure it's long string of letters to make it more secure
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

router.get('/', checkAuthenticated, (req, res) => {
  res.render('teachers', { name: req.user.name })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('teachers/login')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  //using local strategy
  //passport middleware
  successRedirect: '/teachers',
  failureRedirect: 'login',
  failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('teachers/register')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)


  //teacher.save()
  try {
    const teacher = new Teacher({
      //id: Date.now().toString(),
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })
    /*const example = {
      _id: 123123123123123,
      id: '1617261286683',
      name: 'hello',
      email: 'hello@hello',
      password: '$2b$10$rKGsbqmaHqAOXCMvOjhDx.tBKLgyDilRN65XtxU87yct9iSL2tQ8S'
    }*/
    //console.log(example.id)


    users.push({
      //automatically generated w/ database
      //id is timestamp
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      sup: "sup",
    })
    await teacher.save()
    /*var car = Teacher.find(function (err, teacher) {
      if (err) return console.error(err);
      return(teacher);
    })
    console.log(car)*/
    /*Teacher.find(function (err, teachers) {
      if (err) return console.error(err);
      console.log(teachers);
    })*/
    //console.log(await Teacher.find({email: "maxwellzye@gmail.com"}))
    //const cow = await Teacher.find({});
    /*const watermelon = Teacher.find(function (err, teacher) {
      if (err) return console.error(err);
      return teacher.find(function (user1) {
        return user1.id === id;
      })
    })*/
    res.redirect('login')
    console.log(teacher)
    //console.log(users)
  } catch {
    res.redirect('register')
    console.log("Something went wrong")
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
    return res.redirect('/teachers')
  }

  next()
}



module.exports = router