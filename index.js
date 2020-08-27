require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

// Mongoose Connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log(`Connected to ${process.env.NODE_ENV} MongoDB`))
  .catch((err) => console.error("Could not connect...", err));

// Static Routes
app.use("/public", express.static("public"));

// API Routes
const tours = require("./routes/tours.js");
app.use(`/api/${process.env.API_VERSION}/tours`, tours);

// Start API Server
app.listen(process.env.API_PORT, function () {
  console.log(
    `SigConsulting Dialer API ${process.env.API_VERSION} on Port ${process.env.API_PORT}! - End Point: /api/${process.env.API_VERSION}`
  );
});
