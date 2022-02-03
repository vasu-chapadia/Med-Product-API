const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    default: 0,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Types",
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  likeCount: {
    type: Number,
  },
});

exports.Product = mongoose.model("Product", productSchema);
