"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Logout method
const logout = (req, res) => {
    // For JWT-based auth, logout is handled client-side by removing the token
    // If using sessions, you would call req.logout() here
    return res.status(200).send({ message: "Logout successful" });
};
exports.default = logout;
//# sourceMappingURL=logout.js.map