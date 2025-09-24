const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const { storeReturnTo } = require("../Utility/auth_validation");
const user = require("../collections/user_collection");

router.get("/register", user.register_form);
router.post("/register", user.register);
router.get("/login", user.login_form);

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  user.login
);

router.get("/logout", user.logout);

module.exports = router;
