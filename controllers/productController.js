const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");

const getAllItem = asyncHandler(async (req, res) => {
  try {
    const {
      page,
      pageSize,
      category,
      minPrice,
      maxPrice,
      sortField,
      sortOrder,
      searchTerm,
    } = req.query;

    if (page < 1 || pageSize <= 0) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "invalid pagination" });
    }

    if (Number(minPrice) > Number(maxPrice)) {
      // console.log("minprice is greater");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "invalid range" });
    } else {
      const totalProducts = await Product.find();
      let query = Product.find();

      const filter = {};

      if (category) {
        filter.category = category;
      }

      if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
          filter.price.$gte = parseInt(minPrice);
        }

        if (maxPrice) {
          filter.price.$lte = parseInt(maxPrice);
        }
      }

      query = query.find(filter);

      if (sortField && sortOrder) {
        const sortOptions = {};
        sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
        query = query.sort(sortOptions);
      }

      if (searchTerm) {
        const regexPattern = new RegExp(searchTerm, "i");
        query = query.or([
          { title: { $regex: regexPattern } },
          { description: { $regex: regexPattern } },
          { brand: { $regex: regexPattern } },
        ]);
      }

      const currentPage = page ? parseInt(page) : 1;
      const limit = pageSize ? parseInt(pageSize) : 10;

      query = query.skip((currentPage - 1) * limit).limit(limit);

      const results = await query.exec();

      const message = {};

      results.length
        ? ((message.success = "products found"),
          (message.status = HTTP_STATUS.OK))
        : ((message.error = "product not found"),
          (message.status = HTTP_STATUS.UNPROCESSABLE_ENTITY));

      return res.status(message.status).json({
        message,
        totalProducts: totalProducts.length,
        currentPage,
        foundProducts: results.length,
        results,
      });
    }
  } catch (error) {
    throw new Error("internal server error");
  }
});

const createItem = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req).array();
    // console.log(errors);
    if (errors.length === 0) {
      const { name, description, price, imageUrl, category, inStock } =
        req.body;

      const newProduct = new Product({
        name,
        description,
        price,
        imageUrl,
        category,
        inStock,
      });

      await newProduct
        .save()
        .then((product) => {
          return res
            .status(HTTP_STATUS.CREATED)
            .json({ message: "product creation successful", product });
        })
        .catch((err) => {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({ message: "could not create product", err });
        });
    } else {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "invalid inputs provided", errors });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

const getOneItem = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    await Product.findById(id)
      .then((product) => {
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "product found", product });
      })
      .catch((error) => {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "product not found", error });
      });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" }); // Updated HTTP status to 500 (Internal Server Error)
  }
});

const updateItem = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req).array();
    if (errors.length === 0) {
      const id = req.params.id;

      const { name, description, price, imageUrl, category, inStock } =
        req.body;

      await Product.findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          imageUrl,
          category,
          inStock,
        },
        { new: true }
      )
        .then((product) => {
          res.status(200).json({ message: "product updated", product });
        })
        .catch((error) => {
          res.status(400).json({ message: "could not find product", error });
        });
    } else {
      return res
        .status(400)
        .json({ message: "invalid inputs provided", errors });
    }
  } catch (error) {
    res.status(400);
    throw new Error("Internal server error");
  }
});

const deleteItem = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await Product.findById(id);

    if (deletedItem) {
      res
        .status(HTTP_STATUS.OK)
        .json({ message: "item deleted successfully", deletedItem });
    } else {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "item not found" });
    }
  } catch (error) {
    throw new Error("an error occured");
  }
});

module.exports = {
  getAllItem,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
};
