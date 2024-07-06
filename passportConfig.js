const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

function passportInit() {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, {
            message: "User does not exist in database.",
          });
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password is wrong" });
        }
      } catch (e) {
        return done(null, false, { message: "Username is not valid." });
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
}

module.exports = passportInit;
