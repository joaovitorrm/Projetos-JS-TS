const canva = document.querySelector(".game-canva");
const ctx = canva.getContext("2d");

canva.width = 896;
canva.height = 577;

const gameStatus = document.querySelector(".game-status");

import Game from "./Game.js";

const game = new Game(ctx, gameStatus);

game.init();

// MAIN LOOP
const run = () => {

    game.update();
    game.draw();

    requestAnimationFrame(run)
}

run();
