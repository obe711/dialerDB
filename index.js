require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

const tours = require("./routes/tours.js");
app.use(`/api/${process.env.API_VERSION}/tours`, tours);

app.listen(process.env.API_PORT, function () {
  console.log(
    `SigConsulting Dialer API ${process.env.API_VERSION} on Port ${process.env.API_PORT}! - End Point: /api/${process.env.API_VERSION} (${process.env.NODE_ENV})`
  );
});
