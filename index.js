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

app.use("/api/user", UserRouter);
