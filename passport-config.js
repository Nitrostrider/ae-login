const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

async function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    //red debugging
    console.log("----------------Start of Log-------------")

    console.log("email is " + typeof email)
    console.log(email)

    console.log("getUserByEmail is " + typeof getUserByEmail)
    console.log(getUserByEmail)
    //red make both getUserByEmail() and getUserById() into async/await functions
    
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
}

module.exports = initialize