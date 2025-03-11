"use strict";
// @ts-ignore
const socket = io();
socket.on("connect", () => {
    console.log("connected");
});
const cardsContainer = document.querySelector(".cards");
const emojis = [
    { emoji: '👍', name: 'Ok' },
    { emoji: '🚀', name: 'Foguete' },
    { emoji: '🤔', name: 'Pensando' },
    { emoji: '📚', name: 'Livro' },
    { emoji: '💻', name: 'Computador' },
    { emoji: '🎉', name: 'Festa' },
    { emoji: '😊', name: 'Sorriso' },
    { emoji: '👫', name: 'Amizade' },
    { emoji: '📱', name: 'Celular' },
    { emoji: '📺', name: 'Televisao' },
    { emoji: '🎈', name: 'Balao' },
    { emoji: '📸', name: 'Camera' },
    { emoji: '🚫', name: 'Pare' },
    { emoji: '👎', name: 'Não Gostei' },
    { emoji: '🤷‍♂️', name: 'Confuso' },
    { emoji: '📊', name: 'Gráfico' },
    { emoji: '💸', name: 'Dinheiro' },
    { emoji: '📈', name: 'Tabelas' },
    { emoji: '🚗', name: 'Carro' },
    { emoji: '🏠', name: 'Casa' },
    { emoji: '😀', name: 'Feliz' },
    { emoji: '😃', name: 'Alegria' },
    { emoji: '😄', name: 'Sorridente' },
    { emoji: '😆', name: 'Riso' },
    { emoji: '😂', name: 'Risada' },
    { emoji: '🤣', name: 'Gargalhada' },
    { emoji: '😊', name: 'Felizinho' },
    { emoji: '😇', name: 'Anjinho' },
    { emoji: '😍', name: 'Apaixonado' },
    { emoji: '😗', name: 'Beijinho' },
    { emoji: '😚', name: 'Beijao' },
    { emoji: '😛', name: 'Linguinha' },
    { emoji: '😝', name: 'Linguona' },
    { emoji: '😞', name: 'Chateado' },
    { emoji: '😟', name: 'Preocupacao' },
    { emoji: '😠', name: 'Irritado' },
    { emoji: '😡', name: 'Furioso' }
];
function loadCards() {
    const emojiCopy = [...emojis].sort(() => Math.random() - 0.5);
    let c = 0;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 5; x++) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const card = document.createElement("div");
            card.addEventListener("click", () => handleCardClick(card));
            card.classList.add("card");
            const icon = document.createElement("span");
            icon.classList.add("icon");
            icon.textContent = emojiCopy[c].emoji;
            const name = document.createElement("p");
            name.classList.add("name");
            name.textContent = emojiCopy[c].name;
            card.append(icon, name);
            cardsContainer.appendChild(card);
            c++;
        }
    }
}
const handleCardClick = (card) => {
    card.classList.toggle("down");
};
loadCards();
