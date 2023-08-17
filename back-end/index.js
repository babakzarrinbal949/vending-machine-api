const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 3000;
require("./db/init");

const userController = require("./controllers/userController");
const productController = require("./controllers/productController");
const authController = require("./controllers/authController");

app.use(bodyParser.json());
app.use(cors());

app.use("/users", userController);
app.use("/products", productController);
app.use("/auth", authController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;