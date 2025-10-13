const Product = require("../models/product");
const ExpressError = require("../Utility/AppError");

const categories = ["food", "beverages", "snacks", "sauce", "cigarettes"];

module.exports.index = async (req, res, next) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { category, q } = req.query;
    let filter = {};

    // Filter by category
    if (category && categories.includes(category)) {
      filter.category = category;
    }

    // Search filter
    if (q && q.trim() !== "") {
      filter.name = new RegExp(q, "i");
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const db = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("inventory/index", {
      db,
      categories,
      category,
      q,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.new_form = (req, res) => {
  res.render("inventory/new", { categories });
};

module.exports.create = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    // newProduct.user = req.user._id;
    await newProduct.save();
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
