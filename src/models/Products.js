const { model, Schema } = require("mongoose");

const productSchema = new Schema({
  category: String,
  description: String,
  id: Number,
  image: String,
  price: Number,
  title: String
});

module.exports = model("product", productSchema);
