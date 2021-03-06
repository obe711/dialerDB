const router = require("express").Router();
const { Tour } = require("../models/Tour");
const { apiErrorHandler } = require("../services");

// POST ONE New
router.get("/post", async (req, res) => {
  try {
    const ph = req.query.phone;
    const regexObj = / ^(?:\+?1?[-.\s]?)(\d{3})([-.\s])(\d{3})\2(\d{4})$ /;
    const phone =
      "+" +
      `${regexObj.test(ph) ? `${ph.replace(regexObj, $1$2$3)}` : ph}`.trim();
    res.json(await new Tour({ ...req.query, phone, sms: [] }).save());
  } catch (err) {
    apiErrorHandler(res, err);
  }
});

// PUT ONE Update
router.post("/put/:id", async (req, res) => {
  try {
    await Tour.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send("ok");
  } catch (err) {
    apiErrorHandler(res, err);
  }
});

// DELETE ONE
router.get("/delete/:id", async (req, res) => {
  try {
    await Tour.deleteOne({ _id: req.params.id });
    res.status(200).send("ok");
  } catch (err) {
    apiErrorHandler(res, err);
  }
});

// GET ONE by _id
router.get("/get/:id", async (req, res) => {
  try {
    res.json(await Tour.findById(req.params.id).lean());
  } catch (err) {
    apiErrorHandler(res, err);
  }
});

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
    apiErrorHandler(res, err);
  }
});

module.exports = router;
