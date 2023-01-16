const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser").json;
var http = require("http");
const app = express();
app.use(cors());
app.use(bodyParser());

require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

setInterval(function () {
  http.get("http://localhost:3000/");
  require("./config/deactivate-expired-products");
  require("./config/auto-send-email-to-almost-expired-products");

  console.log("--------Restarted--------");
}, 1200000);

require("./config/db");

const UserRouter = require("./routes/general/user");
const ContactUsRouter = require("./routes/general/contact-us");

const CategoryRouter = require("./routes/admin/categories");
const SubCategoryRouter = require("./routes/admin/sub-category");
const ProductApprovalRouter = require("./routes/admin/product-approval");

const BuyerNeedsRouter = require("./routes/buyer/buyer-needs");

const ProductRouter = require("./routes/seller/products");

app.use("/api/user", UserRouter, ContactUsRouter);

app.use("/api/admin", ProductApprovalRouter, SubCategoryRouter, CategoryRouter);

app.use("/api/product", ProductRouter);

app.use("/api/buyer-needs", BuyerNeedsRouter);
