const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser").json;

const app = express();
app.use(cors());
app.use(bodyParser());

require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

require("./config/db");
const UserRouter = require("./routes/user");
const ProductRouter = require("./routes/products");
const CategoryRouter = require("./routes/categories");
const BuyerNeedsRouter = require("./routes/buyer-needs");

app.use("/api/user", UserRouter);
app.use("/api/product", ProductRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/buyer-needs", BuyerNeedsRouter);
