const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  userName: { type: String },
  password: { type: String },
  deposit: { type: Number },
  role: { type: String },
  token: { type: String, default: null },
});

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
