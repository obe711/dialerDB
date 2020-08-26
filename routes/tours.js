const express = require("express");
const router = express.Router();

// Test
router.get("/", async (req, res) => {
  res.send("Route Tours Works!");
});

module.exports = router;
