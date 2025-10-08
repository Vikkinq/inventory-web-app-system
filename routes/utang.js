// routes/utang.js
const express = require("express");
const router = express.Router();

const { isLoggedIn, isAdmin } = require("../Utility/auth_validation");

const utang_controllers = require("../collections/utang_collections");

// 📌 Render Utang tab (list + modal for add)
router.get("/", isLoggedIn, isAdmin, utang_controllers.utang_tab);

// 📌 Add new utang
router.post("/", isLoggedIn, isAdmin, utang_controllers.add_utang);

// 📌 Fully Paid Button
router.post("/:id/fullpay", isLoggedIn, isAdmin, utang_controllers.fullPaid);

// 📌 Delete utang
router.delete("/:id", isLoggedIn, isAdmin, utang_controllers.deleteUtang);

module.exports = router;
