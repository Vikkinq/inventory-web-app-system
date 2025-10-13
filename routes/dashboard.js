const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../Utility/auth_validation");
const Product = require("../models/product");
const Sale = require("../models/sales");

const controller = require("../collections/dashboard_collection");

router.get("/", isLoggedIn, isAdmin, controller.dashboard);
router.get("/chart-data", controller.getChartData);

module.exports = router;
