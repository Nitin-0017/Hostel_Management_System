"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
let users = ["John", "Jane"];
const getUsers = (req, res) => {
    res.status(200).json({
        success: true,
        data: users,
    });
};
exports.getUsers = getUsers;
const createUser = (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({
            success: false,
            message: "Name is required",
        });
        return;
    }
    users.push(name);
    res.status(201).json({
        success: true,
        message: "User created",
        data: users,
    });
};
exports.createUser = createUser;
//# sourceMappingURL=user.controller.js.map