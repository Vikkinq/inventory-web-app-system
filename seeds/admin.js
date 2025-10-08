if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// scripts/createAdmin.js
const mongoose = require("mongoose");
const User = require("../models/users");

const mongo_url = process.env.MONGO_ATLAS;

main().catch((err) => console.log("Error Connection", err));
async function main() {
  await mongoose.connect(mongo_url);
  console.log("DB CONNECTED!");
}

const admin = async () => {
  try {
    await User.deleteMany({});
    const admin = new User({
      username: "admin",
      email: "fritzsymon23@gmail.com",
      role: "admin",
    });
    await User.register(admin, "blancaflorfamily");
    console.log("Admin account created!");
  } catch (err) {
    console.error(`Seed Error: `, err);
  } finally {
    await mongoose.disconnect();
    console.log("DISCONNECTED!");
  }
};

admin();
