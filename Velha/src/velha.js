"use strict";
// @ts-ignore
const socket = io();
const playerName = localStorage.getItem("name");
localStorage.clear();
const playersLogos = document.querySelectorAll(".player-logo");
const playersNames = document.querySelectorAll(".player-name");
const playersAmount = document.querySelector(".total-players");
const piecesFrames = document.querySelectorAll((".piece-frame"));
const playersContainers = document.querySelectorAll(".player");
const winsAmounts = document.querySelectorAll(".wins-amount");
const resetBtn = document.querySelector(".reset-btn");
const wantToResetAmount = document.querySelector(".want-reset");
if (playerName === undefined || playerName === null) {
    socket.emit("player_joined", "unknown");
}
else {
    socket.emit("player_joined", playerName);
}
const gridDiv = document.querySelectorAll(".rows");
function addClickListeners() {
    gridDiv.forEach((rows, y) => {
        Array.from(rows.children).forEach((col, x) => {
            col.addEventListener("click", () => {
                socket.emit("player_clicked", x, y);
            });
        });
    });
    resetBtn.addEventListener("click", () => {
        socket.emit("want-to-reset", "reset");
    });
}
socket.on("update_grid", (grid) => {
    playersContainers[0].classList.remove("victory");
    playersContainers[1].classList.remove("victory");
    grid.forEach((rows, y) => {
        rows.forEach((piece, x) => {
            gridDiv[y].children[x].innerHTML = piece;
        });
    });
});
socket.on("want-to-reset", (n) => {
    wantToResetAmount.innerHTML = n.toString();
});
socket.on("update_screen", (players, activePlayers) => {
    for (let i = 0; i < 2; i++) {
        if (!players[i]) {
            playersNames[i].innerHTML = "";
            playersLogos[i].innerHTML = "";
            piecesFrames[i].innerHTML = "";
            winsAmounts[i].innerHTML = "0";
            playersContainers[i].classList.remove("turno");
        }
        else {
            playersNames[i].innerHTML = players[i].name;
            playersLogos[i].innerHTML = players[i].icone;
            piecesFrames[i].innerHTML = players[i].piece;
            winsAmounts[i].innerHTML = players[i].wins.toString();
            playersContainers[i].classList.remove("turno");
            if (players[i].turn) {
                playersContainers[i].classList.add("turno");
            }
        }
    }
    playersAmount.innerHTML = activePlayers.toString();
});
socket.on("winner", (players) => {
    for (let i = 0; i < 2; i++) {
        winsAmounts[i].innerHTML = players[i].wins.toString();
        playersContainers[i].classList.remove("turno");
        if (players[i].won) {
            playersContainers[i].classList.add("victory");
        }
    }
});
function main() {
    addClickListeners();
}
;
main();
