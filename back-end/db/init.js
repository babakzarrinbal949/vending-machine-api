const mongoose = require("mongoose");

var uri = "mongodb://localhost:27017/details";

mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
