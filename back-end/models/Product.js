const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  amountAvailable: { type: Number },
  cost: { type: Number },
  productName: { type: String },
  sellerId: { type: String },
});
const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
