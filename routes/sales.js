const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Sale = require("../models/sales");

const { storeReturnTo } = require("../Utility/auth_validation");
const { isLoggedIn, isAdmin } = require("../Utility/auth_validation");

const controller = require("../collections/sales_collections");

// Show sales page
router.get("/", isLoggedIn, isAdmin, controller.sales_tab);

// POST /sales
router.post("/", isLoggedIn, isAdmin, controller.sales);

module.exports = router;
