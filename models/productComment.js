const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: String,
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{ timestamps: true });

exports.Comment = mongoose.model("Comment", commentSchema);
