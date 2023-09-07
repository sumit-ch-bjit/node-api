const Item = require("../models/productModel");
const { body, validationResult } = require("express-validator");

const productValidator = {
  create: [
    body("name").notEmpty(),
    body("description").notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("imageUrl").isURL(),
    body("category").isIn([
      "Electronics",
      "Clothing",
      "Books",
      "Beauty",
      "Other",
    ]),
    body("inStock").isBoolean(),
  ],
};

const productUpdateValidator = {
  create: [
    body("name").optional(),
    body("category")
      .optional()
      .custom((value) => {
        if (
          value &&
          !["Electronics", "Clothing", "Books", "Beauty", "Other"].includes(
            value
          )
        ) {
          throw new Error("Invalid category");
        }
        return true;
      }),
    body("price").optional().isFloat({ min: 0 }),
  ],
};

const orderValidationRules = () => {
  return [
    body("user").isMongoId().withMessage("Invalid user ID"),
    body("products").isArray().withMessage("Products must be an array"),
    body("products.*.product").isMongoId().withMessage("Invalid product ID"),
    body("products.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ];
};

const validateOrders = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

// const orderValidator = (req, res, next) => {
//   const { user_id, products } = req.body;

//   const error = {};

//   if (!user_id) {
//     error.user_id = "user id is required";
//   }
//   if (!products || products.length === 0) {
//     error.products = "product array need at least one object";
//   }
//   if (Object.keys(error).length !== 0) {
//     res.status(400).json({ message: "mandatory fields are missing", error });
//   } else {
//     next();
//   }
// };

const userValidator = {
  register: [
    body("username")
      .exists()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("cannot be empty and must be alphanumeric")
      .bail(),
    body("email").isEmail().withMessage("has to be a valid email").bail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
      })
      .withMessage(
        "password should be 8 character long and must contain 1 lowercase, 1 uppercase and 1 symbol"
      )
      .bail(),
    body("role")
      .optional()
      .custom((value) => {
        if (value && !["admin", "user"].includes(value)) {
          throw new Error("Invalid user type");
        }
        return true;
      })
      .bail(),
    body("firstName").notEmpty().withMessage("fistname cannot be empty"),
    body("lastName").notEmpty().withMessage("lastname cannot be empty"),
    // Add more validation for address fields if needed
  ],
};

module.exports = {
  productValidator,
  // orderValidator,
  userValidator,
  productUpdateValidator,
  orderValidationRules,
  validateOrders,
};
