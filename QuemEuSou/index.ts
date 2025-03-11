import express from "express";
import { Server } from "socket.io";
import { join } from "node:path";

import * as data from './emojis.json';

const app = express();

let players : {red: string, blue: string} = {red: "", blue: ""};
let matchEmojis : {emoji: string, name: string}[] = [];
let actualPlayer : string = "";
let faces : {blue: {name: string, emoji: string}, red: {name: string, emoji: string}} = {blue: {name: "", emoji: ""}, red: {name: "", emoji: ""}}

app.use(express.static("public"));

const server = app.listen(3000, () => {
    console.log("listening on *:3000");
});

app.get("/", (req, res) => {    
    res.sendFile(join(__dirname, "index.html"));
})

const io = new Server(server);

io.on("connection", (socket) => {

    if (players.blue === "" && players.red === "") {
        actualPlayer = socket.id;
    }

    if (players.blue === "") {
        players.blue = socket.id;
        socket.emit("player_joined", "blue");
    } else {        
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

    socket.on("message_sent", (msg: string) => {
        io.emit("message_receive", msg, socket.id);
    })

    socket.on("guess_face", (face : string, playerColor : string) => {
        let otherPlayer = playerColor === "blue" ? "red" : "blue";
        if (faces[playerColor as keyof typeof faces].emoji === face) {
            io.emit("player_victory", otherPlayer, faces[playerColor as keyof typeof faces], faces[otherPlayer as keyof typeof faces]);
        } else {
            io.emit("player_defeat", otherPlayer, faces[playerColor as keyof typeof faces], faces[otherPlayer as keyof typeof faces]);
        }
    })
    socket.on("change_player", () => {
        if (actualPlayer === players.blue) {
            actualPlayer = players.red;
        } else {
            actualPlayer = players.blue;
        }
        io.emit("load_interface", actualPlayer);
    })

    socket.on("disconnect", () => {
        if (players.blue === socket.id) {
            players.blue = "";
            if (actualPlayer === socket.id) {
                actualPlayer = players.red;
            }
        } else {
            players.red = "";
            actualPlayer = players.blue;
        }
        if (players.blue === "" || players.red === "") {
            matchEmojis = [];
            faces = {blue: {name: "", emoji: ""}, red: {name: "", emoji: ""}}
            io.emit("clear_grid", "clear");
        }
    })
})

function randomizeEmojis(emojis : {name: string, emoji: string}[]) {
    return [...data.emojis].sort(() => Math.random() - 0.5).slice(0, 5*4);
}
