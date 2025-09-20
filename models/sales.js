const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesSchema = new Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // selling price per unit at time of sale
        marketPrice: { type: Number, required: true }, // cost price per unit at time of sale
        subtotal: { type: Number, required: true }, // price * quantity
        profit: { type: Number, required: true }, // (price - marketPrice) * quantity
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", salesSchema);
