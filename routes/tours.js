const express = require("express");
const router = express.Router();
const { Tour } = require("../models/Tour");

function apiErrorHandler(ex) {
  console.log(ex);
  res.status(404).send("Error");
}

// GET MANY by Search Query
router.get("/:limit/:sort/:dir", async (req, res) => {
  try {
    const { sort, dir, limit } = req.params;
    res.json(
      await Tour.find(req.query ? req.query : {})
        .sort({ [sort]: dir })
        .limit(parseInt(limit))
        .lean()
    );
  } catch (err) {
    apiErrorHandler(err);
  }
});

// GET ONE by _id
router.get("/get/:id", async (req, res) => {
  try {
    res.json(await Tour.findById(req.params.id).lean());
  } catch (err) {
    apiErrorHandler(err);
  }
});

// POST ONE New
router.get("/post", async (req, res) => {
  try {
    await new Tour(req.query).save();
    res.status(200).send("ok");
  } catch (err) {
    apiErrorHandler(err);
  }
});

// PUT ONE Update
router.post("/put/:id", async (req, res) => {
  try {
    await Tour.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send("ok");
  } catch (err) {
    apiErrorHandler(err);
  }
});

// DELETE ONE
router.get("/delete/:id", async (req, res) => {
  try {
    await Tour.deleteOne({ _id: req.params.id });
    res.status(200).send("ok");
  } catch (err) {
    apiErrorHandler(err);
  }
});

module.exports = router;
