import Game from "./game.js";

const socket = io();

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 660;
canvas.height = 840;

const game = new Game(ctx, canvas);

const run = () => {

    game.update();
    game.draw();


    requestAnimationFrame(run);
}


run();