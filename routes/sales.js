const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Sale = require("../models/sales");

const { storeReturnTo } = require("../Utility/auth_validation");
const { isLoggedIn } = require("../Utility/auth_validation");

// Routes
router.post("/", isLoggedIn, (req, res, next) => {
  res.send(req.body);
});

router.get("/", isLoggedIn, async (req, res, next) => {
  const allProducts = await Product.find({});
  res.render("sales/sales_tab", { allProducts });
});

module.exports = router;
