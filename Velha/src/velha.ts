// @ts-ignore
const socket = io();

// Seletores
const playersLogos = document.querySelectorAll(".player-logo");
const playersNames = document.querySelectorAll(".player-name");
const playersAmount = document.querySelector(".total-players");
const piecesFrames = document.querySelectorAll((".piece-frame"));
const playersContainers = document.querySelectorAll(".player");
const winsAmounts = document.querySelectorAll(".wins-amount");
const resetBtn = document.querySelector(".reset-btn");
const wantToResetAmount = document.querySelector(".want-reset");
const gridDiv = document.querySelectorAll(".rows")!;

// Salva o nome digitado no localstorage para ser pego quando entrar na pagina
const playerName = localStorage.getItem("name");
localStorage.clear();

// Se o usuario entrou de alguma forma sem digitar o nome fica como unknown
if (playerName === undefined || playerName === null) {
    socket.emit("player_joined", "unknown");
} else {
    socket.emit("player_joined", playerName);
}

// Função que adiciona os event listeners na grid e no botão de reset
function addClickListeners() {
    gridDiv.forEach((rows, y) => {
        Array.from(rows.children).forEach((col, x) => {
            col.addEventListener("click", () => {
                socket.emit("player_clicked", x, y)
            })
        })
    })
    resetBtn!.addEventListener("click", () => {
        socket.emit("want-to-reset", "reset")
    })
}

// Função que atualiza a grid
socket.on("update_grid", (grid : string[][]) => {
    playersContainers.forEach(p => p.classList.remove("victory"));
    grid.forEach((rows, y) => {
        rows.forEach((piece, x) => {
            gridDiv[y].children[x].innerHTML = piece;
        })
    })
})

// Função que altera na pagina o numero de jogadores que querem reiniciar
socket.on("want-to-reset", (n : number) => {
    wantToResetAmount!.innerHTML = n.toString();
})

// Atualiza a interface do usuario
socket.on("update_screen", (players : {name: string, icone: string, id: string, piece: string, wins: number}[], actualPlayer : string) => {
    for (let i = 0; i < 2; i++) {        
        if (!players[i]) {
            playersNames[i].innerHTML = "";
            playersLogos[i].innerHTML = "";
            piecesFrames[i].innerHTML = "";
            winsAmounts[i].innerHTML = "0";            
        } else {            
            playersNames[i].innerHTML = players[i].name;
            playersLogos[i].innerHTML = players[i].icone;
            piecesFrames[i].innerHTML = players[i].piece;
            winsAmounts[i].innerHTML = players[i].wins.toString();

            playersContainers[i].classList.remove("turno");
            if (players[i].id === actualPlayer) {
                playersContainers[i].classList.add("turno");
            }
        }
    }
    playersAmount!.innerHTML = players.length.toString();
});

// Função que roda quando um jogador vence
socket.on("winner", (players : {name: string, icone: string, id: string, piece: string, wins: number}[], winner : string) => {
    for (let i = 0; i < 2; i++) {
        winsAmounts[i].innerHTML = players[i].wins.toString();
        playersContainers[i].classList.remove("turno");
        if (players[i].id === winner) {
            playersContainers[i].classList.add("victory");
        }
    }
});


addClickListeners();
