const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../Utility/auth_validation");

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("utang/utang_tab");
});

module.exports = router;
