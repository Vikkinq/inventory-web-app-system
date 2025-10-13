const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../Utility/auth_validation");
const { validateProduct } = require("../Utility/ValidationUtilities");
const collection = require("../collections/product_collections");

// INDEX (show all products)
router.get("/", collection.index);

// NEW form — admin only
router.get("/new", isLoggedIn, isAdmin, collection.new_form);

// CREATE product — admin only
router.post("/", isLoggedIn, isAdmin, validateProduct, collection.create);

// SHOW product (view details)
router.get("/:id", isLoggedIn, collection.show);

// EDIT form — admin only
router.get("/:id/edit", isLoggedIn, isAdmin, collection.edit_form);

// UPDATE product — admin only
router.put("/:id", isLoggedIn, isAdmin, validateProduct, collection.update);

// DELETE product — admin only
router.delete("/:id", isLoggedIn, isAdmin, collection.delete);

module.exports = router;
