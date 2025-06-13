import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { join } from "node:path";


const app = express();

app.use(express.static(join(__dirname, "..", "frontend")));

const server = createServer(app);

const io = new Server(server);

server.listen(3000, () => {
    console.log("Server running at : 3000");
})

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "frontend", "views", "index.html"))
})
