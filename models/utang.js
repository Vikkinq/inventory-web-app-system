const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Import Sale model for recording payments into sales
const Sale = require("./sales");

const utangSchema = new Schema(
  {
    person: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String, // snapshot of product name
        price: Number, // snapshot of price
        quantity: Number,
        subtotal: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    payments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "paid"],
      default: "active",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual balance (always computed)
utangSchema.virtual("balance").get(function () {
  return this.totalAmount - this.paidAmount;
});

// ✅ Method to handle payments + auto-log + push to Sales
utangSchema.methods.makePayment = async function (amount) {
  if (amount <= 0) {
    throw new Error("Payment amount must be greater than 0");
  }
  if (amount > this.balance) {
    throw new Error("Payment exceeds remaining balance");
  }

  // Add payment
  this.paidAmount = parseFloat((this.paidAmount + amount).toFixed(2));
  this.payments.push({ amount });

  // Update status if fully paid
  if (this.balance <= 0) {
    this.status = "paid";
  }

  // 💾 Save utang record
  await this.save();

  // 📊 Record payment into Sales for tracking profit/revenue
  const sale = new Sale({
    products: this.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      marketPrice: 0, // ⚠️ you might want to pass actual cost here
      subtotal: item.subtotal,
      profit: item.subtotal, // ⚠️ adjust if you want cost-profit calc
    })),
    total: amount, // only log the payment amount
    profit: amount, // for now assume full profit; adjust with cost
  });

  await sale.save();

  return this;
};

module.exports = mongoose.model("Utang", utangSchema);
