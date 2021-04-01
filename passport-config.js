const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

async function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user1 = getUserByEmail(email)
    //console.log(user1)
    if (user1 == null) {
      return done(null, false, { message: "No usasdfaser with that email "});
    }
    try {
      if (await bcrypt.compare(password, user1.password)) {
        return done(null, user1)
      } else {
        return done(null, false, { message: "Password incorrect"})
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
  passport.serializeUser((user1, done) => done(null, user1.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize