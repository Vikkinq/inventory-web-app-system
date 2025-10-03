const { validationSchema } = require("../Utility/ValidationSchema");
const ExpressError = require("./AppError");

module.exports.validateProduct = (req, res, next) => {
  const { error } = validationSchema.validate(req.body);
  if (error) {
    // turn Joi error into a cleaner Express error
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};
