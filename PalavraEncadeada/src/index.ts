import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { join } from "node:path";

const app = express();
app.use(express.static("public"));

const server = createServer(app);

const io = new Server(server);

app.listen(3000, () => {
    console.log("Server running at port: 3000");
})

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
})

io.on("connection", (socket) => {
    console.log("A user joined" + socket.id);
})

