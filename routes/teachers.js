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
//const Teacher = require('../models/teacher')

const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose"))

/*const teacherSchema = new mongoose.Schema({
  name: req.body.name,
  id: Date.now().toString(),
  email: req.body.email,
})*/
const teacherSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  email: { type: String },
  //green probably not necessary, use _id instead
  //id: String,
  password: { type: String },
  __v: false,
})

const Teacher = mongoose.model("Teacher", teacherSchema)


/*use database
const users =[]*/
const users = [
  {
    id: '1617415077055',
    name: 'Teacher1',
    email: 'academiaedge@gmail.com',
    password: '$2b$10$GruNrRLu5LE9dye0s3gwnOOfH4Cs1wXJUTqnJ7gHPHVhQoNzXJP3m',
    //start class
  }
]



const initializePassport = require('./../passport-config')
initializePassport(
  passport,
  function (email) {
    /*const example = {
      id: '1617297614771',
      name: 'w@w',
      email: 'w@w',
      password: '$2b$10$Hs.T52ivYxLZNmIx7viTcecslcdNJ7dk8fRaa5ud5/pj3xlTkoSIe',
    }*/
    /*var abcd = email
    Teacher.findOne({ email: [abcd] }, (error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log(data)
        console.log("(MongoDB) The second parameter of intializePassport is " + typeof data)
        return data
      }
    })*/


    /*Teacher.findOne({ email: [abcd] }, (error, data) => {
      if (error) {
        console.log(error)
      } else {
        //console.log(data)
      }
    })*/
    //red this is equivalent
    /*
    Teacher.find(function (err, teachers) {
      if (err) return console.error(err);
      console.log(teacher);
    })*/
    //red to this
    /*
    console.log(users)
    */
    /*
     return {
       _id: 123123123123123,
       id: '1617261286683',
       name: 'hello',
       email: 'hello@hello',
       password: '$2b$10$rKGsbqmaHqAOXCMvOjhDx.tBKLgyDilRN65XtxU87yct9iSL2tQ8S'
     }*/
    var cow = email
    var fish = users.find(function (grass) {
      return grass.email === cow;
    })
    console.log("(Array)The second parameter of intializePassport is "+ typeof fish)
    //console.log(fish)
    console.log(fish)
    return fish
  },
  function (id) {
    /*return {
      _id: 123123123123123,
      id: '1617261286683',
      name: 'hello',
      email: 'hello@hello',
      password: '$2b$10$rKGsbqmaHqAOXCMvOjhDx.tBKLgyDilRN65XtxU87yct9iSL2tQ8S'
    }*/
    /*var smoothie = function(user1, done) {
      Teacher.find({id: user1.id}, function (err, data) {
        if(err) return console.log(err);
        done(null, data);
      })
    }
    console.log(smoothie)
    return smoothie*/
    /*const example = {
      id: '1617302467465',
      name: 'w',
      email: 'w@w',
      password: '$2b$10$u.3ObQNPHzrAbrcx4pJGZ.nCVF6q89Z0z7FqOvheUAuLE6xbcc4RK'
    }
*/
    //return example
    /*var abcde = id
    Teacher.findOne({ id: [abcde] }, (error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log(data)
        return data
      }
    })*/
    var blanket = users.find(function (user1) {
      return user1.id === id;
    })
    return blanket
    /*Teacher.find(function (err, teachers) {
      if (err) return console.error(err);
      teachers.find(function (user1) {
        return user1.id === id;
      })
    })*/
  }
)
/*Teacher.find(function (err, teachers) {
  if (err) return console.error(err);
  console.log(teachers);
})*/

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