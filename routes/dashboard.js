const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../Utility/auth_validation");
const Product = require("../models/product");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    // Run queries in parallel
    const [totalProducts, totalStockAgg, totalValueAgg, recentProducts] = await Promise.all([
      Product.countDocuments(), // total number of products
      Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]), // sum of stock
      Product.aggregate([
        { $group: { _id: null, value: { $sum: { $multiply: ["$stock", "$price"] } } } }, // total value of stock
      ]),
      Product.find().sort({ _id: -1 }).limit(5), // recent 5 products
    ]);

    // Wrap results in an object for destructuring
    const dashboard = {
      totalProducts,
      totalStock: totalStockAgg[0]?.total || 0,
      totalValue: totalValueAgg[0]?.value || 0,
      recentProducts,
    };

    // Destructure
    const { totalProducts: productsCount, totalStock, totalValue, recentProducts: latestProducts } = dashboard;

    res.render("dashboard/main", {
      totalProducts: productsCount,
      totalStock,
      totalValue,
      recentProducts: latestProducts,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not load dashboard!");
    res.redirect("/products");
  }
});

module.exports = router;
