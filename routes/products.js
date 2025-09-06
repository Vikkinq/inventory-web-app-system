const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const ExpressError = require("../Utility/AppError");

const categories = ["food", "beverages", "snacks", "sauce", "cigarettes"];

// INDEX (show all products)
router.get("/", async (req, res) => {
  const { category } = req.query;
  const db = category ? await Product.find({ category }) : await Product.find({});
  if (!db) {
    throw new ExpressError("Cannot find data", 404);
  }
  res.render("inventory/index", { db, categories });
});

// NEW form
router.get("/new", (req, res) => {
  res.render("inventory/new", { categories });
});

// CREATE product
router.post("/", async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
});

// SHOW product
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      throw new ExpressError("Cannot find data", 404);
    }
    res.render("inventory/show", { foundProduct });
  } catch (err) {
    next(err);
  }
});

// EDIT form
router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      throw new ExpressError("Cannot find data", 404);
    }
    res.render("inventory/update", { foundProduct, categories });
  } catch (err) {
    next(err);
  }
});

// UPDATE product
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${foundProduct._id}`);
  } catch (err) {
    next(err);
  }
});

// DELETE product
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
