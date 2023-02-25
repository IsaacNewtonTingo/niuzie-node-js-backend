const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

const cors = require("cors");
const bodyParser = require("body-parser").json;

app.use(cors());
app.use(bodyParser());

require("dotenv").config();

const PORT = process.env.PORT;

// io.on("connection", (socket) => {
//   console.log(`${socket.id} user just connected!`);

//   io.emit("Fuck", "Fuck me");

//   socket.on("disconnect", () => {
//     socket.disconnect();
//     console.log("A user disconnected");
//   });
// });

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

setInterval(function () {
  require("./jobs/deactivate-expired-products");
  require("./jobs/auto-send-sms-to-almost-expired-products");
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
const AdminPaymentRouterRouter = require("./routes/admin/payments");
const CategorySubRouter = require("./routes/general/category-sub");
const AddAdminRouter = require("./routes/admin/users");

app.use("/api/user", UserRouter, ContactUsRouter);
app.use(
  "/api/admin",
  ProductApprovalRouter,
  SubCategoryRouter,
  CategoryRouter,
  ChargeRouter,
  ContactUsMessagesRouter,
  AdminPaymentRouterRouter,
  AddAdminRouter
);
app.use("/api/product", ProductRouter);
app.use("/api/buyer-needs", BuyerNeedsRouter);
app.use("/api/premium", JoinPremiumRouter);
app.use("/api/payments", PaymentsRouter);
app.use("/api/category", CategorySubRouter);
