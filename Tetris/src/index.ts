import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

const server = createServer(app);

const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "..")));

app.listen(3000, () => {
    console.log("Server running at port : 3000")
})

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "index.html"))
})