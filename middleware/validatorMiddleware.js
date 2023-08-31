const Item = require("../models/productModel");
const { body } = require("express-validator");

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
  create: [
    body("username")
      .exists()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("cannot be empty and must be alphanumeric"),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    // Add more validation for address fields if needed
  ],
};

module.exports = {
  productValidator,
  // orderValidator,
  userValidator,
  productUpdateValidator,
};
