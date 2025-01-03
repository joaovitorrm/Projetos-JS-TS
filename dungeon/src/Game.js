import Player from "./Player.js"
import MapLoader from "./MapLoader.js";
import textures from "./Textures.js";

// GAME CLASS
class Game {

    gameStatusDiv;
    playerHealthDiv;
    levelDiv;
    playerItensDiv;

    constructor(ctx, gameStatusDiv) {
        this.ctx = ctx;
    
        this.player = new Player(ctx);
        this.mapLoader = new MapLoader(ctx);

        this.mapLoader.changeToLevel(0);

        this.player.setMap(this.mapLoader);
        this.gameStatusDiv = gameStatusDiv;

        this.playerHealthDiv = this.gameStatusDiv.querySelector(".player-health");
        this.levelDiv = this.gameStatusDiv.querySelector(".level");
        this.playerItensDiv = this.gameStatusDiv.querySelector(".player-itens");

        this.player.parentFunctions.updateHealth = this.drawPlayerHealth.bind(this);
        this.player.parentFunctions.updateItens = this.drawPlayerItens.bind(this);
    }

    init() {
        this.drawPlayerHealth();
    }

    drawPlayerHealth() {
        this.playerHealthDiv.innerHTML = "";
        for (let i = 0; i < this.player.player.max_lives; i++) {
            const live = document.createElement("img");
            if (i >= this.player.player.current_lives) {
                live.src = textures["vidaRuim"].src;
            } else {
                live.src = textures["vidaBom"].src;
            }
            this.playerHealthDiv.append(live);
        }
    }

    drawPlayerItens() {
        this.playerItensDiv.innerHTML = "";
        for (const item in this.player.player.inventory) {
            const i = document.createElement("a");
            i.append(textures[item]);
            this.playerItensDiv.append(i);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, 832, 512);
        this.mapLoader.draw();

        for (const d of this.mapLoader.devices) {
            d.draw();
        }

        this.player.draw();
    };

    update() {
        this.player.update();
    };

}

export default Game;