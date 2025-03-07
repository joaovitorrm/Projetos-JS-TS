import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
let activePlayers = 0;
let players = [];
let actualPlayer = "";
const emojis = ["😊", "🔥", "😀", "😂", "👦🏻", "😎", "🫡", "🤔", "😐", "😣", "🥱", "😫"];
let resets = [];
let win = false;
let grid = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
const verticalHorizontalWin = {
    0: [1, 2],
    1: [0, 2],
    2: [0, 1],
};
app.use(express.static(join(__dirname, "src")));
server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "src", "index.html"));
});
app.get("/jogar", (req, res) => {
    if (activePlayers > 1) {
        res.sendFile(join(__dirname, "src", "index.html"));
    }
    else {
        res.sendFile(join(__dirname, "src", "jogo.html"));
    }
});
// Quando um novo cliente se conecta
io.on('connection', (socket) => {
    io.emit("update_player_joined_status", activePlayers);
    // Captura o "room" em que o usuário deve entrar
    socket.on('entrarNoJogo', (pagina) => {
        console.log(`Usuário ${socket.id} entrou na sala ${pagina}`);
        socket.join(pagina); // O usuário entra na "room" correspondente à página
    });
    // Exemplo de evento enviado para uma "room" específica
    socket.on('mensagem', (pagina, mensagem) => {
        console.log(`Mensagem recebida na sala ${pagina}:`, mensagem);
        io.to(pagina).emit('mensagem', mensagem); // Envia a mensagem para todos os clientes na mesma "room"
    });
    socket.on("player_joined", (name) => {
        players.push({ name: name, icone: emojis[Math.floor(Math.random() * emojis.length)], id: socket.id, piece: "O", wins: 0, won: false, turn: false });
        if (activePlayers === 0) {
            actualPlayer = players[0].id;
            players[0].turn = true;
            players[0].piece = "X";
        }
        // Atualiza o contador de jogadores
        activePlayers++;
        io.emit("update_player_joined_status", activePlayers);
        // Recebe a grid atualizada
        io.emit("update_grid", grid);
        // Atualiza a tela
        io.emit("update_screen", players, activePlayers);
        // Checa o click do jogador
        socket.on("player_clicked", (x, y) => {
            if (activePlayers > 1 && actualPlayer === socket.id && grid[y][x] === "" && !win) {
                grid[y][x] = players[players.findIndex(p => p.id === actualPlayer)].piece;
                io.emit("update_grid", grid);
                if (checkWin(x, y)) {
                    win = true;
                    let wonPlayer = players[players.findIndex(p => p.id === actualPlayer)];
                    wonPlayer.won = true;
                    wonPlayer.wins++;
                    io.emit("winner", players);
                }
                else {
                    actualPlayer === players[0].id ? actualPlayer = players[1].id : actualPlayer = players[0].id;
                    players.forEach(p => p.id === actualPlayer ? p.turn = true : p.turn = false);
                }
                // Atualiza a tela
                io.emit("update_screen", players, activePlayers);
            }
        });
        // Remove da contagem quando sai da pagina
        socket.on('disconnect', () => {
            activePlayers--;
            players.splice(players.findIndex(p => p.id === socket.id), 1);
            if (activePlayers > 0) {
                actualPlayer = players[0].id;
                players[0].piece = "x";
                players.forEach(p => p.id === actualPlayer ? p.turn = true : p.turn = false);
                // Atualiza a tela        
                io.emit("update_screen", players, activePlayers);
            }
            win = false;
            grid = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];
            players.forEach((p) => {
                p.won = false;
            });
            resets = [];
            if (activePlayers > 1) {
                actualPlayer === players[0].id ? actualPlayer = players[1].id : actualPlayer = players[0].id;
            }
            else {
                actualPlayer = players[0].id;
            }
            players.forEach(p => p.id === actualPlayer ? p.turn = true : p.turn = false);
            io.emit("update_grid", grid);
            io.emit("update_screen", players, activePlayers);
            console.log(players);
            console.log('Usuário desconectado:', socket.id);
        });
        socket.on("want-to-reset", () => {
            if (!resets.includes(socket.id)) {
                resets.push(socket.id);
                if (resets.length === activePlayers) {
                    win = false;
                    grid = [
                        ["", "", ""],
                        ["", "", ""],
                        ["", "", ""]
                    ];
                    players.forEach((p) => {
                        p.won = false;
                    });
                    resets = [];
                    if (activePlayers > 1) {
                        actualPlayer === players[0].id ? actualPlayer = players[1].id : actualPlayer = players[0].id;
                    }
                    else {
                        actualPlayer = players[0].id;
                    }
                    players.forEach(p => p.id === actualPlayer ? p.turn = true : p.turn = false);
                    io.emit("update_grid", grid);
                    io.emit("update_screen", players, activePlayers);
                }
            }
            else {
                resets.splice(resets.indexOf(socket.id));
            }
            io.emit("want-to-reset", resets.length);
        });
    });
});
function checkWin(x, y) {
    if (grid[y][x] === grid[verticalHorizontalWin[y][0]][x] && grid[y][x] === grid[verticalHorizontalWin[y][1]][x]) {
        return true;
    }
    else if (grid[y][x] === grid[y][verticalHorizontalWin[x][0]] && grid[y][x] === grid[y][verticalHorizontalWin[x][1]]) {
        return true;
    }
    else {
        if ((x === 0 && y === 0) || (x === 2 && y === 2)) {
            if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
                return true;
            }
        }
        else if ((x === 0 && y === 2) || (x === 2 && y === 0)) {
            if (grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]) {
                return true;
            }
        }
    }
    return false;
}
