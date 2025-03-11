import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

let players : {name: string, icone: string, id: string, piece: string, wins: number}[] = [];
let actualPlayer : string = "";
let winner : string = "";

const emojis = ["😊","🔥","😀","😂","👦🏻","😎","🫡","🤔","😐","😣","🥱","😫"];

let resets : string[] = [];

let grid = [
  ["","",""],
  ["","",""],
  ["","",""]
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
  if (players.length > 1) {
    res.sendFile(join(__dirname, "src", "index.html"));
  } else {
    res.sendFile(join(__dirname, "src", "jogo.html"));
  }
});

// Quando um novo cliente se conecta
io.on('connection', (socket) => {  

  io.emit("update_player_joined_status", players.length);

  socket.on("player_joined", (name : string) => {

    players.push({name: name, icone: emojis[Math.floor(Math.random() * emojis.length)], id: socket.id, piece: "O", wins: 0});

    if (players.length === 1) {
      actualPlayer = players[0].id;
      players[0].piece = "X";
    }

    // Atualiza o contador de jogadores
    io.emit("update_player_joined_status", players.length);

    // Recebe a grid atualizada
    io.emit("update_grid", grid);

    // Atualiza a tela
    io.emit("update_screen", players, actualPlayer);

    // Checa o click do jogador
    socket.on("player_clicked", (x ,y) => {

      // Se não tem jogadores suficientes retorna
      if (players.length < 2) return;

      // Se alguem venceu retorna
      if (winner != "") return;

      // Se não for o jogador correto em seu turno retorna
      if (actualPlayer != socket.id) return;

      // Se o espaço da grid estiver ocupado retorna
      if (grid[y][x] != "") return;
      
      grid[y][x] = players[players.findIndex(p => p.id === actualPlayer)].piece;

      io.emit("update_grid", grid);

      if (checkWin(x, y)) {
        winner = actualPlayer;
        io.emit("winner", players, winner);
      } else {
        actualPlayer === players[0].id ? actualPlayer = players[1].id : actualPlayer = players[0].id;

        // Atualiza a tela
        io.emit("update_screen", players, actualPlayer);        
      }
    })

    // Remove da contagem quando sai da pagina
    socket.on('disconnect', () => {
      // Remove o jogador da lista
      players.splice(players.findIndex(p => p.id === socket.id), 1);

      // Se não tem jogadores retornar
      if (players.length === 0) return;

      resetGame();
    });

    // O que acontece quando clicam no botão reset
    socket.on("want-to-reset", () => {
      // Se o jogador não clicou é inserido na lista dos que querem resetar
      if (!resets.includes(socket.id)) {
        resets.push(socket.id);
        // Se todos da partida quiserem o jogo irá reiniciar
        if (resets.length === players.length) {
          resetGame();
        }
      // Caso ja esteja na lista e clicou novamente, ele será removido da lista
      } else {
        resets.splice(resets.indexOf(socket.id));
      }
      io.emit("want-to-reset", resets.length);
    });
  });
});

// Verificação de quem ganhou o jogo
function checkWin(x : number, y : number) : boolean {
  if (grid[y][x] === grid[verticalHorizontalWin[y as keyof typeof verticalHorizontalWin][0]][x] && grid[y][x] === grid[verticalHorizontalWin[y as keyof typeof verticalHorizontalWin][1]][x]) {
      return true;
  }
  else if (grid[y][x] === grid[y][verticalHorizontalWin[x as keyof typeof verticalHorizontalWin][0]] && grid[y][x] === grid[y][verticalHorizontalWin[x as keyof typeof verticalHorizontalWin][1]]) {
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

// Função que reinicia o jogo
function resetGame() {
  resets = [];
  winner = "";
  grid = [
    ["","",""],
    ["","",""],
    ["","",""]
  ];

  if (players.length === 0) return;
  
  if (players.length === 1) {
    actualPlayer = players[0].id;
    players[0].piece = "x";
  } else {
    actualPlayer === players[0].id ? actualPlayer = players[1].id : actualPlayer = players[0].id;
  };    

  io.emit("update_grid", grid);
  io.emit("update_screen", players, actualPlayer);
}