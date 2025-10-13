if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Product = require("../models/product");
const Sales = require("../models/sales");
const items = require("./seeds");

const mongo_url = process.env.MONGO_ATLAS || "mongodb://127.0.0.1:27017/inventoryApp";

main().catch((err) => console.log("Error Connection", err));
async function main() {
  await mongoose.connect(mongo_url);
  console.log("DB CONNECTED!");
}

const seedDB = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(items);

    console.log(`Seeded ${items.length} Travel Spots`);
  } catch (err) {
    console.error(`Seed Error: `, err);
  } finally {
    await mongoose.disconnect();
    console.log("DISCONNECTED!");
  }
};

const deleteSales = async () => {
  try {
    await Sales.deleteMany({});

    console.log(`Seeded ${items.length} Travel Spots`);
  } catch (err) {
    console.error(`Seed Error: `, err);
  } finally {
    await mongoose.disconnect();
    console.log("DISCONNECTED!");
  }
};

// seedDB();
deleteSales();
