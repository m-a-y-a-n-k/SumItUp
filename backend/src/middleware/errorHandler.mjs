const errorHandler = (err, req, res, next) => {
  // Custom error handling logic
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
