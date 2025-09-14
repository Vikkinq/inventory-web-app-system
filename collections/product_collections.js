const Product = require("../models/product");
const ExpressError = require("../Utility/AppError");

const categories = ["food", "beverages", "snacks", "sauce", "cigarettes"];

module.exports.index = async (req, res) => {
  const { category } = req.query;
  const db = category ? await Product.find({ category }) : await Product.find({});
  if (!db) {
    throw new ExpressError("Cannot find data", 404);
  }
  res.render("inventory/index", { db, categories });
};

module.exports.new_form = (req, res) => {
  res.render("inventory/new", { categories });
};

module.exports.create = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
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
};

module.exports.edit_form = async (req, res, next) => {
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
};

module.exports.update = async (req, res, next) => {
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
};

module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
};
