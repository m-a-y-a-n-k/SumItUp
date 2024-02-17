const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  adEligible: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", userSchema);
