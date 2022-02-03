const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Comment } = require("../models/productComment");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

//Post Comment
//http://localhost:3000/products/61fa7c74dca7dcba240606ea/comments/create

router.post("/:product_id/comments/create", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.product_id)) {
    return res.status(400).send("Invalid Product Id!");
  }
  const product = await Product.findOne({ _id: req.params.product_id });
  if (!product) return res.status(400).send("Product With Given ID Not Found"); //Product Check
  res.send(product);
});

module.exports = router;
