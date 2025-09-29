const Utang = require("../models/utang");
const Product = require("../models/product");
const Sale = require("../models/sales");

module.exports.utang_tab = async (req, res) => {
  try {
    const utangs = await Utang.find().sort({ createdAt: -1 });
    const products = await Product.find().sort({ name: 1 }); // for product dropdown in modal
    res.render("utang/utang_tab", { utangs, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports.add_utang = async (req, res) => {
  try {
    const { person, items } = req.body;

    if (!items || Object.keys(items).length === 0) {
      return res.status(400).send("No items provided for utang");
    }

    // Normalize items to array
    const normalizedItems = Array.isArray(items) ? items : Object.values(items);

    let totalAmount = 0;
    const mappedItems = [];

    for (const item of normalizedItems) {
      if (!item.productId) {
        throw new Error("Missing productId for one of the items");
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const quantity = parseInt(item.quantity, 10) || 1;
      const subtotal = product.price * quantity;

      totalAmount += subtotal;

      mappedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        subtotal,
        marketPrice: product.marketPrice || product.price, // fallback
      });
    }

    const utang = new Utang({
      person,
      items: mappedItems,
      totalAmount,
      paidAmount: 0,
      balance: totalAmount,
      status: "active",
      payments: [],
    });

    await utang.save();
    res.redirect("/utang");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error creating utang");
  }
};

module.exports.fullPaid = async (req, res) => {
  try {
    const utang = await Utang.findById(req.params.id);
    if (!utang) return res.status(404).send("Utang not found");

    if (utang.balance <= 0) return res.redirect("/utang");

    const remaining = utang.balance;

    // Mark fully paid
    utang.paidAmount += remaining;
    utang.balance = 0;
    utang.status = "paid";
    utang.payments.push({ amount: remaining, date: new Date() });

    await utang.save();

    // Log Sale
    const saleItems = utang.items.map((i) => ({
      product: i.productId,
      quantity: i.quantity,
      price: i.price,
      subtotal: i.subtotal,
      profit: (i.price - (i.marketPrice || i.price)) * i.quantity,
    }));

    const profit = saleItems.reduce((acc, i) => acc + (i.profit || 0), 0);

    await Sale.create({
      customer: utang.person,
      items: saleItems,
      total: remaining,
      profit,
      paymentType: "Full Utang Payment",
    });

    res.redirect("/utang");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking as fully paid");
  }
};

module.exports.deleteUtang = async (req, res) => {
  try {
    await Utang.findByIdAndDelete(req.params.id);
    res.redirect("/utang");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting utang");
  }
};
