"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthRouter = (0, express_1.Router)();
healthRouter.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy 🚀",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
exports.default = healthRouter;
//# sourceMappingURL=health.routes.js.map