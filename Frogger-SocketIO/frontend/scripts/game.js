import Player from "./player.js";
import texture from "./texture.js";
import MapLoader from "./mapLoader.js";

class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        
        this.moveTexture = 0;
        this.moveMaxTexture = 75;
        this.water = texture.agua;
        this.player = new Player(ctx);
        this.player.setPosition(canvas.width / 2 - this.player.player_hitbox.width / 2, canvas.height - this.player.player_hitbox.height);
        this.ctx.imageSmoothingEnabled = false;

        //this.entities = new Entity(ctx);

        this.mapLoader = new MapLoader(ctx, canvas);
        
       /*  this.entities.createEntity("ball",60,60,{direction:""});
        this.entities.createEntity("sand_castle",420,540,{direction:""});
        this.entities.createEntity("log", 60, 660, {direction: "right", size: "medium"});
        this.entities.createEntity("log", 420, 720, {direction: "right", size: "small"});
        this.entities.createEntity("lilypad", 120, 780); */
    }   

    draw() {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        /* this.ctx.drawImage(texture.estrada,0,this.canvas.height - 720,660,360);

        this.ctx.drawImage(texture.areia, 0, this.canvas.height - 360, 660, 180);

        if(this.moveTexture< this.moveMaxTexture){
            this.moveTexture++;

            this.moveTexture > this.moveMaxTexture/2 ?
                this.ctx.drawImage(texture.agua, 0, this.canvas.height - 180, 660, 180) :
                this.ctx.drawImage(texture.agua_movimento, 0, this.canvas.height - 180, 660, 180);

            if(this.moveTexture == this.moveMaxTexture){
                this.moveTexture = 0;
            }
        } */

        this.mapLoader.draw();
        //this.entities.draw();
        this.player.draw();
        
    }

    update() {
        this.mapLoader.update();
        //this.entities.update();
        this.player.update();
    }
}

export default Game;