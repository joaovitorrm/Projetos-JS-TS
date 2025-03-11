import express from "express";
import { Server } from "socket.io";
import { join } from "node:path";

const app = express();

app.use(express.static("public"));

const server = app.listen(3000, () => {
    console.log("listening on *:3000");
});

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
})

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
})
