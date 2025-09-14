const User = require("../models/users");
const passport = require("passport");

module.exports.register_form = (req, res, next) => {
  res.render("auth/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await User({ email, username });
    const reg_user = await User.register(newUser, password);
    req.login(reg_user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Travel Spot!");
      res.redirect("/products");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.login_form = (req, res, next) => {
  res.render("auth/login");
};

module.exports.login = (req, res, next) => {
  try {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/products";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};
