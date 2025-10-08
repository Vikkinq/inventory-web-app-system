module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in as an admin!");
    return res.redirect("/login");
  }
  if (req.user.role !== "admin") {
    req.flash("error", "You do not have permission to access this page!");
    return res.redirect("/products"); // redirect somewhere safe
  }
  next();
};

module.exports.isGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please log in first!");
    return res.redirect("/login");
  }
  if (req.user.role !== "guest") {
    req.flash("error", "Only guest users can access this page!");
    return res.redirect("/products");
  }
  next();
};
