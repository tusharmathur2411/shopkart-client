const { model, Schema } = require("mongoose");

const cartSchema = new Schema({
  userId: { type: String, required: true },
  productList: { }
});

module.exports = model("Cart", cartSchema);
