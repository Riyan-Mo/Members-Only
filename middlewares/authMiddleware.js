exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/message");
  }
  return next();
};

exports.isAdmin = async (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  return res.redirect("/");
};
