class Game {
    constructor() {
        this.c = 0;
        this.canvas = document.getElementById("game-canvas");
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext("2d");
        this.bgImg = new Image();
        this.bgImg.src = "./assets/background2.png";
        this.setas = new Image();
        this.setas.src = "./assets/setas.png";
    }
    init() {
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.bgImg, 0, 0);
        this.ctx.drawImage(this.setas, 0, 0, 70, 80, 210, 413, 70, 80);
        this.ctx.drawImage(this.setas, 67, 0, 70, 80, 293, 413, 70, 80);
        this.ctx.drawImage(this.setas, 134, 0, 70, 80, 411, 413, 70, 80);
        this.ctx.drawImage(this.setas, 201, 0, 70, 80, 507, 413, 70, 80);
    }
    update() {
        this.c++;
    }
}
function main() {
    const game = new Game();
    function run() {
        game.update();
        game.draw();
        window.requestAnimationFrame(run);
    }
    window.requestAnimationFrame(run);
}
main();
export {};
