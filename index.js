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
const UserRouter = require("./routes/general/user");

const CategoryRouter = require("./routes/admin/categories");
const SubCategoryRouter = require("./routes/admin/sub-category");
const ProductApprovalRouter = require("./routes/admin/product-approval");

const BuyerNeedsRouter = require("./routes/buyer/buyer-needs");

const ProductRouter = require("./routes/seller/products");

app.use("/api/user", UserRouter);

app.use("/api/admin", ProductApprovalRouter, SubCategoryRouter, CategoryRouter);

app.use("/api/product", ProductRouter);

app.use("/api/buyer-needs", BuyerNeedsRouter);
