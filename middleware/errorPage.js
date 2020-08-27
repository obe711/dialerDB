module.exports = function (req, res, next) {
  return res.status(404).send("Endpoint not found - 404");
};
