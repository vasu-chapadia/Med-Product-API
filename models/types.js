const mongoose = require("mongoose");

const typesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
exports.Types = mongoose.model("Types", typesSchema);
