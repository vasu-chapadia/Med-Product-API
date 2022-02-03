const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Types } = require("../models/types");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

//Get All Products//Get By Types//most recent products//most liked
// http://localhost:3000/products?types=61f9e92db64ff85fc1b37549&sort=latest&orderBy=likes
router.get("/", auth, async (req, res, next) => {
  // console.log(req.anyvariable);
  // next(new Error('Cannot get'))
  //.find(query,projection) -projection for fields
  let filter = {};
  if (req.query.types) {
    filter = { type: req.query.types.split(",") };
    const productList = await Product.find(filter, { __v: 0 }).populate("type");
    return res.status(200).send(productList);
  } else if (req.query.sort) {
    const productList = await Product.find()
      .populate("type")
      .sort({ dateCreated: -1 }); //desc
    return res.status(200).send(productList);
  } else if (req.query.orderBy) {
    const productList = await Product.find()
      .populate("type")
      .sort({ like: -1 }); //desc
    return res.status(200).send(productList);
  } else if (req.query.types && req.query.sort) {
    const productList = await Product.find(filter, { __v: 0 })
      .populate("type")
      .sort({ dateCreated: -1 });
    return res.status(200).send(productList);
  } else if (req.query.types && req.query.sort && req.query.orderBy) {
    const productList = await Product.find(filter, { __v: 0 })
      .populate("type")
      .sort({ dateCreated: desc });
    return res.status(200).send(productList);
  }
  return res.status(500).json({ success: false });
});

//Create a Product
// localhost:3000/products/
router.post("/", auth, async (req, res) => {
  const type = await Types.findById(req.body.type);
  if (!type) return res.status(400).send("Invalid Type"); //Type Check
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    type: req.body.type,
    dateCreated: new Date(req.body.dateCreated),
    expiryDate: new Date(req.body.expiryDate),
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

//Get By Id
router.get("/:id", async (req, res) => {
  // console.log(req.params.id);
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id!");
  }
  const product = await Product.findById(req.params.id); //findOne//query
  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

//Update a Product
//patch partial update
//All body fields not mandatory
router.patch("/:id", auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id!");
  }
  // const type = await Types.findById(req.body.type);
  // if (!type) return res.status(400).send("Invalid Type!");
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Product!");
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      // name: req.body.name,
      description: req.body.description,
      // price: req.body.price,
      // type: req.body.type,
    },
    { new: true } //true to return the modified document rather than the original
  );
  if (!updatedProduct)
    return res.status(500).send("the product cannot be updated!");

  res.send(updatedProduct);
});

//Delete a Product
router.delete("/:id", auth, async (req, res) => {
  const result = await Product.findByIdAndDelete(req.params.id);
  try {
    if (!result) {
      res.status(404).json({ success: false, message: "product not found!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "the product is deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.put("/like", auth, async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid Product!");

  const updatedProduct = await Product.findByIdAndUpdate(
    req.body.productId,
    {
      // $push: { like:  },
      $inc: { like: 1 },
    },
    { new: true } //true to return the modified document rather than the original
  );
  if (!updatedProduct) {
    return res.status(500).send("the product cannot be updated!");
  }

  res.send(updatedProduct);
});

module.exports = router;
