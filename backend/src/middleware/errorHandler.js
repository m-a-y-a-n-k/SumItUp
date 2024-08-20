const errorHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;
