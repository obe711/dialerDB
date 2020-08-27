const express = require("express");
const router = express.Router();
const { Tour } = require("../models/Tour");

// Test
router.get("/test", async (req, res) => {
  res.send("Route Tours Works!");
});

// Add New Tour
router.get("/post", async (req, res) => {
  try {
    await new Tour(req.query).save();
    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
    res.status(404).send("Error");
  }
});

// GET Signle Tour
router.get("/get/:id", async (req, res) => {
  try {
    res.json(await Tour.findById(req.params.id).lean());
  } catch (err) {
    console.log(err);
    res.status(404).send("Error");
  }
});

module.exports = router;
