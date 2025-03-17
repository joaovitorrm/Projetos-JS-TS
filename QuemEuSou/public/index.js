"use strict";
// @ts-ignore
const socket = io();
const cardsContainer = document.querySelector(".cards");
const playBtn = document.querySelector(".play-btn");
const joinContainer = document.querySelector(".join-container");
const playingAmount = document.querySelector(".playing-amount");
const player1 = document.querySelector(".player-1");
const player1Face = player1.querySelector(".player-face");
const player1Name = player1.querySelector(".player-face-name");
const player2 = document.querySelector(".player-2");
const player2Face = player2.querySelector(".player-face");
const player2Name = player2.querySelector(".player-face-name");
const chatTextInput = document.querySelector(".chat-text-input");
const sendMessageBtn = document.querySelector(".send-btn");
const textContainer = document.querySelector(".text-container");
const optionsContainer = document.querySelector(".options-container");
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const resetBtn = document.querySelector(".reset-btn");
const answersContainer = document.querySelectorAll(".answer");
const winContainer = document.querySelector(".win-container");
const playerActionDiv = document.querySelector(".player-action");
const guessBtn = document.querySelector(".guess-btn");
let isGuessing = false;
let guessed;
const askBtn = document.querySelector(".ask-btn");
let isAsking = false;
const passTurnBtn = document.querySelector(".pass-turn-btn");
let isActualPlayer = false;
const gameContainer = document.querySelector(".game-container");
const messagesContainer = document.querySelector(".messages");
let playerColor = "";
playBtn.addEventListener("click", () => {
    socket.emit("join_game");
});
yesBtn.addEventListener("click", () => {
    answersContainer[0].innerHTML = "✔️";
    answersContainer[0].classList.remove("wrong");
    answersContainer[0].classList.add("correct");
    socket.emit("answer", "correct", "✔️");
    //socket.emit("change_player", "change_player"); 
});
noBtn.addEventListener("click", () => {
    answersContainer[0].innerHTML = "✖️";
    answersContainer[0].classList.remove("correct");
    answersContainer[0].classList.add("wrong");
    socket.emit("answer", "wrong", "✖️");
    //socket.emit("change_player", "change_player"); 
});
resetBtn.addEventListener("click", () => {
    socket.emit("reset");
});
passTurnBtn.addEventListener("click", () => {
    askBtn.classList.remove("asking");
    socket.emit("change_player");
});
chatTextInput.addEventListener("keyup", (event) => {
    if (chatTextInput.value === "")
        return;
    const e = event;
    if (e.key === "Enter") {
        socket.emit("message_sent", chatTextInput.value);
        chatTextInput.value = "";
    }
});
sendMessageBtn.addEventListener("click", () => {
    if (chatTextInput.value === "")
        return;
    socket.emit("message_sent", chatTextInput.value);
    chatTextInput.value = "";
});
guessBtn.addEventListener("click", () => {
    if (guessBtn.classList.contains("not-you"))
        return;
    guessBtn.classList.add("guessing");
    askBtn.classList.add("not-you");
    isGuessing = !isGuessing;
    playerActionDiv.classList.remove("visible");
});
askBtn.addEventListener("click", () => {
    if (askBtn.classList.contains("not-you"))
        return;
    askBtn.classList.add("asking");
    guessBtn.classList.add("not-you");
    textContainer.classList.add("visible");
    isAsking = !isAsking;
    playerActionDiv.classList.remove("visible");
    socket.emit("is_asking", playerColor);
});
const handleCardClick = (card) => {
    if (isGuessing) {
        guessed = card;
        socket.emit("guess_face", guessed.querySelector(".icon").innerHTML, playerColor === "blue" ? "red" : "blue");
        guessBtn.classList.toggle("guessing");
        isGuessing = !isGuessing;
    }
    else {
        card.classList.toggle("down");
    }
};
socket.on("answered", (pColor, answer, symbol) => {
    answersContainer[1].classList.remove("correct", "wrong");
    answersContainer[1].innerHTML = "";
    if (pColor === playerColor && answer != " ") {
        answersContainer[1].classList.add(answer);
        answersContainer[1].innerHTML = symbol;
    }
});
socket.on("message_receive", (message, author) => {
    const m = document.createElement("span");
    m.innerHTML = message;
    if (author === socket.id) {
        m.classList.add(playerColor);
    }
    else {
        playerColor === "blue" ? m.classList.add("red") : m.classList.add("blue");
    }
    messagesContainer.appendChild(m);
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
});
socket.on("player_joined", (color) => {
    playerColor = color;
    gameContainer.classList.add(color);
    joinContainer.classList.remove("visible");
    gameContainer.classList.add("visible");
});
socket.on("player_just_joined", (amount) => {
    playingAmount.innerHTML = amount.toString();
});
socket.on("player_victory", (pColor, faceWin, faceLose) => {
    resetBtn.classList.add("visible");
    if (playerColor === pColor) {
        player1Face.innerHTML = faceWin.emoji;
        player1Name.innerHTML = faceWin.name;
        guessed.classList.add("correct");
        winContainer.classList.add("win");
        winContainer.innerHTML = "Vitória";
        for (const div of cardsContainer.children) {
            if (div.classList.contains("correct"))
                continue;
            div.classList.add("down");
        }
    }
    else {
        player1Face.innerHTML = faceLose.emoji;
        player1Name.innerHTML = faceLose.name;
        winContainer.classList.add("lose");
        winContainer.innerHTML = "Derrota";
        for (const div of cardsContainer.children) {
            if (div.querySelector(".icon").innerHTML === faceLose.emoji) {
                div.classList.add("wrong");
                div.classList.remove("down");
                continue;
            }
            ;
            div.classList.add("down");
        }
    }
});
socket.on("player_defeat", (pColor, faceWin, faceLose) => {
    resetBtn.classList.add("visible");
    if (playerColor === pColor) {
        player1Face.innerHTML = faceWin.emoji;
        player1Name.innerHTML = faceWin.name;
        guessed.classList.add("wrong");
        winContainer.classList.add("lose");
        winContainer.innerHTML = "Derrota";
        for (const div of cardsContainer.children) {
            if (div.classList.contains("wrong"))
                continue;
            div.classList.add("down");
        }
    }
    else {
        player1Face.innerHTML = faceLose.emoji;
        player1Name.innerHTML = faceLose.name;
        winContainer.classList.add("win");
        winContainer.innerHTML = "Vitória";
        for (const div of cardsContainer.children) {
            if (div.querySelector(".icon").innerHTML === faceLose.emoji) {
                div.classList.add("correct");
                continue;
            }
            ;
            div.classList.add("down");
        }
    }
});
socket.on("asked", (pColor) => {
    if (pColor === playerColor) {
        optionsContainer.classList.add("visible");
    }
});
socket.on("load_interface", (actualPlayer) => {
    optionsContainer.classList.remove("visible");
    textContainer.classList.remove("visible");
    resetBtn.classList.remove("visible");
    winContainer.classList.remove("win", "lose");
    if (socket.id === actualPlayer) {
        isActualPlayer = true;
        guessBtn.classList.remove("not-you");
        askBtn.classList.remove("not-you");
        playerActionDiv.classList.add("visible");
    }
    else {
        isActualPlayer = false;
        guessBtn.classList.add("not-you");
        askBtn.classList.add("not-you");
        playerActionDiv.classList.remove("visible");
    }
    answersContainer[0].classList.remove("wrong", "correct");
    answersContainer[0].innerHTML = "";
    answersContainer[1].classList.remove("wrong", "correct");
    answersContainer[1].innerHTML = "";
});
socket.on("load_emojis", (emojis, blue, red) => {
    if (playerColor === "blue") {
        player2Face.innerHTML = blue.emoji;
        player2Name.innerHTML = blue.name;
    }
    else {
        player2Face.innerHTML = red.emoji;
        player2Name.innerHTML = red.name;
    }
    let c = 0;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
            const card = document.createElement("div");
            card.addEventListener("click", () => handleCardClick(card));
            card.classList.add("card");
            const icon = document.createElement("span");
            icon.classList.add("icon");
            icon.textContent = emojis[c].emoji;
            const name = document.createElement("p");
            name.classList.add("name", "red");
            name.textContent = emojis[c].name;
            card.append(icon, name);
            cardsContainer.appendChild(card);
            c++;
        }
    }
});
socket.on("clear_grid", () => {
    resetBtn.classList.remove("visible");
    const unknown = document.createElement("div");
    unknown.classList.add("unknown");
    player1Face.innerHTML = "";
    player1Face.appendChild(unknown);
    player1Name.innerHTML = "";
    cardsContainer.innerHTML = "";
    player2Face.innerHTML = "";
    player2Name.innerHTML = "";
});
