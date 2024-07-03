const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/", (req, res) => res.render("index", { user: req.user }));

router.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

router.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      res.render("sign-up-form");
      next();
    } else {
      try {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await user.save();
        res.redirect("/");
      } catch (e) {
        return next(e);
      }
    }
  });
});

router.get("/login", (req, res) => res.render("login-in-form"));

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post(
  "/login",
  function (req, res, next) {
    console.log(req.body);
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

exports = router;
