const express = require("express");
const Product = require("../models/product");
const Sale = require("../models/sales");

module.exports.dashboard = async (req, res) => {
  try {
    // Run queries in parallel
    const [
      totalProducts,
      totalStockAgg,
      totalValueAgg,
      recentProducts,
      totalSalesAgg,
      topProductsAgg,
      topStockProducts,
    ] = await Promise.all([
      Product.countDocuments(), // total number of products
      Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]), // sum of stock
      Product.aggregate([
        { $group: { _id: null, value: { $sum: { $multiply: ["$stock", "$price"] } } } }, // total value of stock
      ]),
      Product.find().sort({ _id: -1 }).limit(5), // recent 5 products
      Sale.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]), // total sales amount
      Sale.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product",
            totalSold: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
      ]),
      Product.find().sort({ stock: -1 }).limit(5), // Top 5 by stock
    ]);

    const dashboard = {
      totalProducts,
      totalStock: totalStockAgg[0]?.total || 0,
      totalValue: totalValueAgg[0]?.value || 0,
      totalSales: totalSalesAgg[0]?.total || 0,
      recentProducts,
      topProducts: topProductsAgg,
      topStock: topStockProducts,
    };

    res.render("dashboard/main", dashboard);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not load dashboard!");
    res.redirect("/products");
  }
};
