const Joi = require("joi");

module.exports.validationSchema = Joi.object({
  travelspots: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    province: Joi.string().required(),
    municipality: Joi.string().required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().required(),
    image: Joi.string().uri().optional(),
  }).required(),
});
