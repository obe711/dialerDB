const apiErrorHandler = (res, ex) => {
  console.log(ex);
  return res.status(404).send("Error");
};

module.exports = {
  apiErrorHandler: apiErrorHandler,
};
