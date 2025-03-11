"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_path_1 = require("node:path");
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
const server = app.listen(3000, () => {
    console.log("listening on *:3000");
});
app.get("/", (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, "index.html"));
});
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
