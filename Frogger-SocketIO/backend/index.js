import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const server = createServer(app);
const io = new Server(server);

let ip = "";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname,"..","frontend")));

server.listen(3000, () => {
    console.log("servidor rodando na porta 3000");
});

app.get("/", (req, res) => {

    ip = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";    

    res.sendFile(join(__dirname,"..","frontend","views","index.html"));
});

io.on("connection",(socket)=>{
    console.log("jogador entrou ", "Socket ID : " + socket.id, "Node IP : " + ip, "Socket IP : " + socket.handshake.address);
})