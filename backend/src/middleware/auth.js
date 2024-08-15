const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Assuming JWT contains user info
    next();
  } catch (e) {
    res.status(401).send({ error: "Invalid auth token" });
  }
};

module.exports = authMiddleware;
