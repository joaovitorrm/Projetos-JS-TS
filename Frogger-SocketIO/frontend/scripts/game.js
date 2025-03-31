import Player from "./player.js";
import texture from "./texture.js";
import TextureManager from "./textureManager.js";
import Entity from "./entity.js";

class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        
        this.moveTexture = 0;
        this.moveMaxTexture = 75;
        this.water = texture.agua;
        this.player = new Player(ctx);
        this.ctx.imageSmoothingEnabled = false;

        this.textureManager = new TextureManager();

        this.entity = new Entity(ctx);

        this.textureManager.setTexture("sapo_verde");

        this.entity.createEntity("sapo_verde", this.textureManager.getTexture("sapo_verde"), 60, 60);

    }   


    draw() {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "hsl(200, 50%, 50%)";
        this.ctx.fillRect(0, this.canvas.height - 180, 660, 180);

        this.ctx.fillStyle = "hsl(40, 50%, 50%)";
        this.ctx.fillRect(0, this.canvas.height - 360, 660, 180);

        this.ctx.fillStyle = "hsl(40, 0%, 20%)";
        this.ctx.fillRect(0, this.canvas.height - 600, 660, 240);


        this.ctx.fillStyle = "hsl(100, 60%, 50%)";
        this.ctx.fillRect(0, this.canvas.height - 780, 660, 180);

        this.ctx.drawImage(texture.estrada,0,this.canvas.height - 720,660,360);
        this.ctx.drawImage(texture.carro,360,this.canvas.height - 720, 240,180);

        this.ctx.drawImage(texture.areia, 0, this.canvas.height - 360, 660, 180);

        this.ctx.drawImage(texture.parasol, 60, this.canvas.height - 360, 180, 180);
        this.ctx.drawImage(texture.bola_volei, 360, this.canvas.height - 360, 60, 60);

        this.ctx.drawImage(texture.castelo_areia, 480, this.canvas.height - 300, 60, 60);

        if(this.moveTexture< this.moveMaxTexture){
            this.moveTexture++;

            this.moveTexture > this.moveMaxTexture/2 ?
                this.ctx.drawImage(texture.agua, 0, this.canvas.height - 180, 660, 180) :
                this.ctx.drawImage(texture.agua_movimento, 0, this.canvas.height - 180, 660, 180);

            if(this.moveTexture == this.moveMaxTexture){
                this.moveTexture = 0;
            }
        }        
        this.ctx.drawImage(texture.tora, 60,this.canvas.height - 120, 180, 60)
        this.ctx.drawImage(texture.torinha, 300,this.canvas.height - 60, 120, 60)
        this.ctx.drawImage(texture.derrota_aiger,420,this.canvas.height - 180,60,60)
        this.player.draw();

        
    }

    update() {
        this.player.update();
    }
}

export default Game;