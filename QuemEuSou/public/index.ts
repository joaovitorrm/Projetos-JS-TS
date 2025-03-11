// @ts-ignore
const socket = io();

const cardsContainer = document.querySelector(".cards")!;

const player1 = document.querySelector(".player-1")!;
const player1Face = player1.querySelector(".player-face")!;
const player1Name = player1.querySelector(".player-face-name")!;

const player2 = document.querySelector(".player-2")!;
const player2Face = player2.querySelector(".player-face")!;
const player2Name = player2.querySelector(".player-face-name")!;

const chatTextInput = document.querySelector(".chat-text-input")! as HTMLInputElement;
const sendMessageBtn = document.querySelector(".send-btn")! as HTMLButtonElement;

const textContainer = document.querySelector(".text-container")!;
const optionsContainer = document.querySelector(".options-container")!;

const yesBtn = document.querySelector(".yes-btn")! as HTMLButtonElement;
const noBtn = document.querySelector(".no-btn")! as HTMLButtonElement;

const winContainer = document.querySelector(".win-container")!;

const guessBtn = document.querySelector(".guess-btn") as HTMLButtonElement;
let isGuessing = false;
let guessed : HTMLDivElement;

let isActualPlayer = false;

const gameContainer = document.querySelector(".game-container");

const messagesContainer = document.querySelector(".messages");

let playerColor = "";

yesBtn.addEventListener("click", () => {
    socket.emit("change_player", "change_player");
})

noBtn.addEventListener("click", () => {
    socket.emit("change_player", "change_player");
})

chatTextInput.addEventListener("keyup", (event) => {
    if (chatTextInput.value === "") return;

    const e = event as KeyboardEvent;
    if (e.key === "Enter") {
        socket.emit("message_sent", chatTextInput.value);
        chatTextInput.value = "";
    }
})

sendMessageBtn.addEventListener("click", () => {
    if (chatTextInput.value === "") return;
    socket.emit("message_sent", chatTextInput.value);
    chatTextInput.value = "";
})

guessBtn.addEventListener("click", () => {
    if (guessBtn.classList.contains("not-you")) return;
    guessBtn.classList.toggle("guessing");
    isGuessing = !isGuessing;
})

const handleCardClick = (card: HTMLDivElement) => {
    if (isGuessing) {
        guessed = card;        
        socket.emit("guess_face", guessed.querySelector(".icon")!.innerHTML, playerColor === "blue" ? "red" : "blue");
        guessBtn.classList.toggle("guessing");
        isGuessing = !isGuessing;
    } else {
        card.classList.toggle("down");
    }
}

socket.on("message_receive", (message: string, author: string) => {
    const m = document.createElement("span");
    m.innerHTML = message;
    if (author === socket.id) {
        m.classList.add(playerColor)
    } else {
        playerColor === "blue" ? m.classList.add("red") : m.classList.add("blue");
    }
    messagesContainer!.appendChild(m);
    messagesContainer!.scrollTo(0, messagesContainer!.scrollHeight);
})

socket.on("player_joined", (color : string) => {
    playerColor = color;
    gameContainer!.classList.add(color);
})

socket.on("player_victory", (pColor : string, faceWin : {name: string, emoji: string}, faceLose : {name: string, emoji: string}) => {
    if (playerColor === pColor) {
        player2Face.innerHTML = faceWin.emoji;
        player2Name.innerHTML = faceWin.name;
        guessed.classList.add("correct");
        winContainer.classList.add("win");
        winContainer.innerHTML = "Vitória";
        for (const div of cardsContainer.children) {
            if (div.classList.contains("correct")) continue;
            div.classList.add("down");
        }
    } else {
        player2Face.innerHTML = faceLose.emoji;
        player2Name.innerHTML = faceLose.name;
        winContainer.classList.add("lose");
        winContainer.innerHTML = "Derrota";
        for (const div of cardsContainer.children) {
            if (div.querySelector(".icon")!.innerHTML === faceLose.emoji) {
                div.classList.add("wrong");
                continue;
            };
            div.classList.add("down");
        }
    }    
})

socket.on("load_interface", (actualPlayer : string) => {
    if (socket.id === actualPlayer) {
        textContainer.classList.add("visible");
        optionsContainer.classList.remove("visible");
        isActualPlayer = true;
        guessBtn.classList.remove("not-you");
    } else {
        optionsContainer.classList.add("visible");
        textContainer.classList.remove("visible");
        isActualPlayer = false;
        guessBtn.classList.add("not-you");
    }
})

socket.on("load_emojis", (emojis : {emoji: string, name: string}[], blue : {emoji: string, name: string}, red : {emoji: string, name: string}) => {

    if (playerColor === "blue") {
        player1Face.innerHTML = blue.emoji;
        player1Name.innerHTML = blue.name;
    } else {
        player1Face.innerHTML = red.emoji;
        player1Name.innerHTML = red.name;
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
})

socket.on("clear_grid", () => {
    cardsContainer.innerHTML = "";
    player1Face.innerHTML = "";
    player1Name.innerHTML = "";
})