"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const node_path_1 = require("node:path");
const app = (0, express_1.default)();
app.use(express_1.default.static((0, node_path_1.join)(__dirname, "..", "frontend")));
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
server.listen(3000, () => {
    console.log("Server running at : 3000");
});
app.get("/", (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, "..", "frontend", "views", "index.html"));
});
