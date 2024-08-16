// Logout method
const logout = (req, res) => {
  req.logout(); // Passport method to log out the user
  res.status(200).send({ message: "Logout successful" });
};

module.exports = logout;
