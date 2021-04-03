const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Teacher = require('./models/teacher')
const passport = require("passport")

//const initializePassport = require('./../passport-config')

//async function initialize(passport, getUserByEmail, getUserById)
const authenticateUser = async (email, password, done) => {
  function getUserByEmail(email) {
    /*const example = {
      id: '1617297614771',
      name: 'w@w',
      email: 'w@w',
      password: '$2b$10$Hs.T52ivYxLZNmIx7viTcecslcdNJ7dk8fRaa5ud5/pj3xlTkoSIe',
    }*/
    /*
    var abcd = email
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
  }
  function getUserById(id) {
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
        console.log("asdfasdfas")
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

  //red debugging
  console.log("----------------Start of Log-------------")

  console.log("email is " + typeof email)
  console.log(email)

  console.log("getUserByEmail is " + typeof getUserByEmail)
  console.log(getUserByEmail)
  //red make both getUserByEmail() and getUserById() into async/await functions

  async function test() {
    return await getUserByEmail()
  }
  async function whatever() {
    const hello = await test()
    console.log("did it work")
    console.log(hello)
  }
  whatever()

  const user1 = getUserByEmail(email)
  console.log("user1 is " + typeof user1)
  console.log(user1)

  //yellow code starts
  if (user1 == null) {
    console.log("Email not registered")
    return done(null, false, { message: "No user in the database with that email. " });
  } else {
    console.log("Email is registered")
  }
  try {
    if (await bcrypt.compare(password, user1.password)) {
      console.log("Password correct")
      return done(null, user1)
    } else {
      console.log("Password incorrect")
      return done(null, false, { message: "Password incorrect." })
    }
  } catch (e) {
    return done(e)
  }
}

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
passport.serializeUser((user1, done) => done(null, user1.id))
passport.deserializeUser((id, done) => {
  return done(null, getUserById(id))
})

module.exports = passport