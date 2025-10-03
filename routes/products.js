const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../Utility/auth_validation");
const { validateProduct } = require("../Utility/ValidationUtilities");
const collection = require("../collections/product_collections");

// INDEX (show all products)
router.get("/", isLoggedIn, collection.index);

// NEW form
router.get("/new", isLoggedIn, collection.new_form);

// CREATE product
router.post("/", isLoggedIn, validateProduct, collection.create);

// SHOW product
router.get("/:id", isLoggedIn, collection.show);

// EDIT form
router.get("/:id/edit", isLoggedIn, validateProduct, collection.edit_form);

// UPDATE product
router.put("/:id", isLoggedIn, validateProduct, collection.update);

// DELETE product
router.delete("/:id", isLoggedIn, collection.delete);

module.exports = router;
