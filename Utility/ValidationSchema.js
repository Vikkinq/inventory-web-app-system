const Joi = require("joi");

const categories = ["food", "beverages", "snacks", "sauce", "cigarettes"];

module.exports.validationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Product name is required.",
    "string.min": "Product name must be at least 2 characters.",
    "string.max": "Product name must be less than 100 characters.",
  }),

  category: Joi.string()
    .valid(...categories)
    .required()
    .messages({
      "any.only": "Category must be one of: food, beverages, snacks, sauce, cigarettes.",
      "string.empty": "Category is required.",
    }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),

  marketPrice: Joi.number().min(0).optional().messages({
    "number.base": "Market price must be a number.",
    "number.min": "Market price cannot be negative.",
  }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number.",
    "number.integer": "Stock must be an integer.",
    "number.min": "Stock cannot be negative.",
    "any.required": "Stock is required.",
  }),
});
