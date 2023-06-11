const { model, Schema } = require("mongoose");

const orderSchema = new Schema({
  userId: { type: String, required: true },
  productList: { },
  totalAmount: { type: Number, default: 0 },
  createDate: { type: Date, default: Date.now },
  status: { type: String, default: "Order Placed" },
});

module.exports = model("Order", orderSchema);
