const mongoose = require("mongoose");
const Product = require("../models/product");

main().catch((err) => console.log("Error Connection", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/inventoryApp");
  console.log("DB CONNECTED!");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const seedProducts = [
  {
    name: "Coke 1L",
    price: 50,
    category: "beverages",
    stock: 20,
  },
  {
    name: "Mineral Water 500ml",
    category: "beverages",
    price: 15,
    stock: 40,
  },
  {
    name: "Lucky Me Pancit Canton",
    category: "snacks",
    price: 15,
    stock: 60,
  },
  {
    name: "Nissin Cup Noodles",
    category: "snacks",
    price: 35,
    stock: 25,
  },
  {
    name: "Piattos (Cheese)",
    category: "snacks",
    price: 20,
    stock: 30,
  },
];

Product.insertMany(seedProducts)
  .then((newProduct) => {
    console.log("Successfully Stored: ", newProduct);
  })
  .catch((err) => {
    console.log("Failed to Store: ", err);
  });
