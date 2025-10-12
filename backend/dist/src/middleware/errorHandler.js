"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: "Internal Server Error" });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map