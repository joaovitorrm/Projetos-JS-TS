import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "src")));
server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "src", "index.html"));
});
app.get("/chat-1", (req, res) => {
    res.sendFile(join(__dirname, "src", "chats", "chat1.html"));
    io.to("chat-1").emit("hello", "world");
});
app.get("/chat-2", (req, res) => {
    res.sendFile(join(__dirname, "src", "chats", "chat2.html"));
});
// Quando um novo cliente se conecta
io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);
    // Captura o "room" em que o usuário deve entrar
    socket.on('entrarNoChat', (pagina) => {
        console.log(`Usuário ${socket.id} entrou na sala ${pagina}`);
        socket.join(pagina); // O usuário entra na "room" correspondente à página
    });
    // Exemplo de evento enviado para uma "room" específica
    socket.on('mensagem', (pagina, mensagem) => {
        console.log(`Mensagem recebida na sala ${pagina}:`, mensagem);
        io.to(pagina).emit('mensagem', mensagem); // Envia a mensagem para todos os clientes na mesma "room"
    });
    // Quando o usuário se desconecta
    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
    });
});
