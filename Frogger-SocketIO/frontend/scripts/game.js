import Player from "./player.js";
import MapLoader from "./mapLoader.js";

class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.player = new Player(ctx);
        this.player.setPosition(
            (canvas.width / 2) - (this.player.player_hitbox.width / 2) - this.player.player_hitbox.offsetX,
            (canvas.height - this.player.player_hitbox.offsetY) - this.player.player_hitbox.height - 60);
        this.ctx.imageSmoothingEnabled = false;

        this.mapLoader = new MapLoader(ctx, canvas);
            
        this.generateMap();
    }

    draw() {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        this.mapLoader.draw();
        this.player.draw();
    }

    update() {
        this.mapLoader.update();
        this.player.update();

        let playerPos = this.player.getPosition();

        this.checkSreenCollision(playerPos);
        this.checkMapScrollY(playerPos);
    }

    async generateMap() {
        await this.mapLoader.generateSpecificMapFromMapName("meio_fio");
        for (let i = 0; i < 5; i++) {
            const map = await this.mapLoader.generateRandomMap();
//            this.mapLoader.generateRandomEntity(map, 6);
        }
    }

    checkSreenCollision(playerPos) {
        if (playerPos.x + this.player.player_hitbox.width > this.canvas.width) {
            this.player.setPosition((playerPos.x - 60), playerPos.y);
        } else if (playerPos.x + this.player.player_hitbox.width < 0) {
            this.player.setPosition((playerPos.x + 60), playerPos.y);
        } else if (playerPos.y + this.player.player_hitbox.height > this.canvas.height) {
            this.player.setPosition(playerPos.x, (playerPos.y - 60));
        }
    }

    checkMapScrollY(playerPos) {
        if (playerPos.y < this.canvas.height / 3) {
            this.player.setPosition(playerPos.x, playerPos.y + 60);
            this.mapLoader.increaseScrollY(60);
            if (this.mapLoader.getLastMapY() > -60) {
                this.mapLoader.generateRandomMap();
            }
        }
    }


}

export default Game;