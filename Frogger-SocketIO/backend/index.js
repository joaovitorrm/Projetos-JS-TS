import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname,"..","frontend")));


server.listen(3000, () => {
    console.log("servidor rodando na porta 3000");
});

app.get("/", (req, res) => {
    res.sendFile(join(__dirname,"..","frontend","views","index.html"));
});

io.on("connection",(socket)=>{
    console.log("jogador entrou ", socket.id);
})