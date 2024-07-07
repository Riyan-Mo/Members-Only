require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passportInit = require("./passportConfig");
const signupController = require("./controllers/signupController");
const loginController = require("./controllers/loginController");
const messageController = require("./controllers/messageController");
const { isAuth, isLoggedIn, isAdmin } = require("./middlewares/authMiddleware");

const passport = passportInit();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    // store: MongoStore.create({ mongoUrl: mongoDb }),
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", isLoggedIn, (req, res) => res.render("index"));

app.get("/message", isAuth, messageController.getMessages);

app.post("/message", isAuth, messageController.postMessage);

app.post("/message/delete", isAuth, isAdmin, messageController.deleteMessage);

app.get("/signup", isLoggedIn, signupController.get);

app.post("/signup", signupController.post);

app.get("/login", isLoggedIn, loginController.get);

app.post(
  "/login",
  loginController.post,
  passport.authenticate("local", {
    successRedirect: "/message",
    failureRedirect: "/login/?error=CredentialsIncorrect",
  })
);

app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    console.log(err);
    return res.redirect("/");
  });
});

async function connect() {
  const mongoDb = process.env.MONGODB_URI;
  try {
    await mongoose.connect(mongoDb);
    console.log("Connected to mongodb");
  } catch (e) {
    console.log(e);
  }
}
connect();

app.listen(3000, () => console.log("app listening on port 3000!"));
