// @ts-ignore
const socket = io();

const messagesContainer = document.querySelector(".messages-box");
const messageInput = document.querySelector(".message-input") as HTMLInputElement;

const paginaAtual = window.location.pathname;

if (paginaAtual != "/") {
    socket.emit("entrarNoChat", paginaAtual);
}

messageInput!.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        socket.emit("mensagem", paginaAtual, messageInput.value);
        messageInput.value = "";
    }
})

socket.on("mensagem", (mensagem : string) => {
    const msg = document.createElement("span");
    msg.innerText = mensagem;
    messagesContainer!.appendChild(msg);
})