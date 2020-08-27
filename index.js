require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const errorPage = require("./middleware/errorPage");

app.use(cors());
app.use(express.json());

// Allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

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
app.use("/static", express.static(path.join(__dirname, "static")));

// API Routes
const tours = require("./routes/tours.js");
app.use(`/api/${process.env.API_VERSION}/tours`, tours);

// 404 Error
app.use("*", errorPage);

// Start API Server
app.listen(process.env.API_PORT, function () {
  console.log(
    `SigConsulting Dialer API ${process.env.API_VERSION} on Port ${process.env.API_PORT}! - End Point: /api/${process.env.API_VERSION}`
  );
});
