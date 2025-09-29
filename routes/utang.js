// routes/utang.js
const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../Utility/auth_validation");

const utang_controllers = require("../collections/utang_collections");

// 📌 Render Utang tab (list + modal for add)
router.get("/", isLoggedIn, utang_controllers.utang_tab);

// 📌 Add new utang
router.post("/", isLoggedIn, utang_controllers.add_utang);

// 📌 Fully Paid Button
router.post("/:id/fullpay", isLoggedIn, utang_controllers.fullPaid);

// 📌 Delete utang
router.delete("/:id", isLoggedIn, utang_controllers.deleteUtang);

module.exports = router;
