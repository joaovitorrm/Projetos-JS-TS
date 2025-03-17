"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const node_path_1 = require("node:path");
const data = __importStar(require("./emojis.json"));
const app = (0, express_1.default)();
let players = { red: "", blue: "" };
let matchEmojis = [];
let actualPlayer = "";
let faces = { blue: { name: "", emoji: "" }, red: { name: "", emoji: "" } };
let playerAmount = 0;
app.use(express_1.default.static("public"));
const server = app.listen(3000, () => {
    console.log("listening on *:3000");
});
app.get("/", (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, "index.html"));
});
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    io.emit("player_just_joined", playerAmount);
    socket.on("join_game", () => {
        if (players.blue != "" && players.red != "") {
            return;
        }
        if (players.blue === "" && players.red === "") {
            actualPlayer = socket.id;
        }
        playerAmount++;
        io.emit("player_just_joined", playerAmount);
        if (players.blue === "") {
            players.blue = socket.id;
            socket.emit("player_joined", "blue");
        }
        else {
            players.red = socket.id;
            socket.emit("player_joined", "red");
        }
        if (players.red != "" && players.blue != "") {
            matchEmojis = randomizeEmojis(matchEmojis);
            faces.blue = matchEmojis[Math.floor(Math.random() * matchEmojis.length)];
            faces.red = matchEmojis[Math.floor(Math.random() * matchEmojis.length)];
            io.emit("load_emojis", matchEmojis, faces.blue, faces.red);
            io.emit("load_interface", actualPlayer);
        }
        socket.on("message_sent", (msg) => {
            io.emit("message_receive", msg, socket.id);
        });
        socket.on("reset", () => {
            io.emit("clear_grid");
            matchEmojis = randomizeEmojis(matchEmojis);
            faces.blue = matchEmojis[Math.floor(Math.random() * matchEmojis.length)];
            faces.red = matchEmojis[Math.floor(Math.random() * matchEmojis.length)];
            io.emit("load_emojis", matchEmojis, faces.blue, faces.red);
            actualPlayer === players.blue ? actualPlayer = players.red : actualPlayer = players.blue;
            io.emit("load_interface", actualPlayer);
        });
        socket.on("guess_face", (face, playerColor) => {
            let otherPlayer = playerColor === "blue" ? "red" : "blue";
            if (faces[playerColor].emoji === face) {
                io.emit("player_victory", otherPlayer, faces[playerColor], faces[otherPlayer]);
            }
            else {
                io.emit("player_defeat", otherPlayer, faces[playerColor], faces[otherPlayer]);
            }
        });
        socket.on("change_player", () => {
            if (actualPlayer === players.blue) {
                actualPlayer = players.red;
            }
            else {
                actualPlayer = players.blue;
            }
            io.emit("load_interface", actualPlayer);
        });
        socket.on("is_asking", (playerColor) => {
            io.emit("asked", playerColor === "blue" ? "red" : "blue");
        });
        socket.on("answer", (answer, symbol) => {
            console.log(answer, symbol);
            io.emit("answered", players.blue === socket.id ? "red" : "blue", answer, symbol);
        });
        socket.on("disconnect", () => {
            playerAmount--;
            io.emit("player_just_joined", playerAmount);
            if (players.blue === socket.id) {
                players.blue = "";
                if (actualPlayer === socket.id) {
                    actualPlayer = players.red;
                }
            }
            else {
                players.red = "";
                actualPlayer = players.blue;
            }
            if (players.blue === "" || players.red === "") {
                matchEmojis = [];
                faces = { blue: { name: "", emoji: "" }, red: { name: "", emoji: "" } };
                io.emit("clear_grid");
            }
        });
    });
});
function randomizeEmojis(emojis) {
    return [...data.emojis].sort(() => Math.random() - 0.5).slice(0, 5 * 4);
}
