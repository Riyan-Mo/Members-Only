const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const connectMongo = require("connect-mongoose");

const mongoDb = "";
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

const app = express();
app.set("views", __dirname+"/views");
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.get("/", (req, res) => res.render("index", {user: req.user}));

app.get("/sign-up", (req, res)=>{
  res.render("sign-up-form")  
})

app.post("/sign-up", (req, res, next)=>{
  bcrypt.hash(req.body.password, 10, async(err, hashedPassword)=>{
    if(err){
      res.render("sign-up-form")
      next();
      }
      else{
      try{
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        })
        await user.save();
        res.redirect("/");
      }catch(e){
        return next(e);
      }
    }
  })
})

app.get("/login", (req, res)=>res.render("login-in-form"))

app.get("/log-out", (req, res, next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect("/");
  })
})

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.use((err, req, res, next)=>{
  console.log(err)
  res.redirect("/")
})

app.listen(3000, () => console.log("app listening on port 3000!"));
