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
  require("./config/deactivate-expired-products");
  require("./config/auto-send-email-to-almost-expired-products");
}, 1200000);

require("./config/db");

const UserRouter = require("./routes/general/user");
const ContactUsRouter = require("./routes/general/contact-us");
const CategoryRouter = require("./routes/admin/categories");
const SubCategoryRouter = require("./routes/admin/sub-category");
const ProductApprovalRouter = require("./routes/admin/product");
const BuyerNeedsRouter = require("./routes/buyer/buyer-needs");
const ProductRouter = require("./routes/seller/products");
const JoinPremiumRouter = require("./routes/general/join-premium");
const ChargeRouter = require("./routes/admin/charge");
const PaymentsRouter = require("./routes/general/user-payments");
const ContactUsMessagesRouter = require("./routes/admin/contact-us");

app.use("/api/user", UserRouter, ContactUsRouter);
app.use(
  "/api/admin",
  ProductApprovalRouter,
  SubCategoryRouter,
  CategoryRouter,
  ChargeRouter,
  ContactUsMessagesRouter
);
app.use("/api/product", ProductRouter);
app.use("/api/buyer-needs", BuyerNeedsRouter);
app.use("/api/premium", JoinPremiumRouter);
app.use("/api/payments", PaymentsRouter);
