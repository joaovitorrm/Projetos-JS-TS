"use strict";
// @ts-ignore
const socket = io();
const onlinePlayersDiv = document.querySelector(".online-players");
const playBtn = document.querySelector(".play-btn");
const nameInput = document.querySelector(".name-input");
socket.on("update_player_joined_status", (activePlayers) => {
    console.log("Entrou alguem");
    onlinePlayersDiv.innerHTML = activePlayers.toString();
});
playBtn.addEventListener("click", (e) => {
    if (nameInput.value === "") {
        e.preventDefault();
        return;
    }
    localStorage.setItem("name", nameInput.value);
});
