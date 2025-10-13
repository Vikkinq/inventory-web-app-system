const Product = require("../models/product");
const Sale = require("../models/sales");

const categories = ["food", "beverages", "sauce", "snacks", "cigarettes", "seasonings", "bisquits", "others"];

module.exports.sales_tab = async (req, res, next) => {
  try {
    const page = parseInt(req.query.p) || 1;
    const limit = parseInt(req.query.limit) || 12;

    let filter = {};
    const { category, q } = req.query;

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

    const allProducts = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    res.render("sales/sales_tab", {
      allProducts,
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

module.exports.sales = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    let profit = 0;

    // ✅ Validate stock first
    for (const item of products) {
      const product = await Product.findById(item.id);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.id}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    // Build sale products
    const saleProducts = products.map((item) => {
      const subtotal = item.price * item.quantity;
      const itemProfit = (item.price - item.marketPrice) * item.quantity;

      total += subtotal;
      profit += itemProfit;

      return {
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        marketPrice: item.marketPrice,
        subtotal,
        profit: itemProfit,
      };
    });

    // Save the Sale
    const sale = new Sale({
      products: saleProducts,
      total,
      profit,
      user: req.user?._id,
    });

    await sale.save();

    // ✅ Decrease stock after validation & saving
    for (const item of products) {
      await Product.updateOne({ _id: item.id }, { $inc: { stock: -item.quantity } });
    }

    res.json({ message: "Sale saved successfully", sale });
  } catch (err) {
    console.error("Error saving sale:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
