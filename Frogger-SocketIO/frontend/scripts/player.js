import texture from "./texture.js";

const body = document.querySelector("body");

class Player {

    constructor(ctx) {
        this.ctx = ctx;
        this.x = -20;
        this.y = -20;
        this.width = 100;
        this.height = 100;
        this.moveSpeed = 60;
        this.moveDelay = 20;
        this.move = 20;
        this.moveX = 0;
        this.moveY = 0;
        
        this.direction = "";

        this.player_sprite = texture.sapo_verde;
        this.player_hitbox = {
            x: this.x,
            y: this.y,
            offsetX: 20,
            offsetY: 20,
            width: 60,
            height: 60
        }

        addEventListener("keydown", (e) => {
            if (e.code === "ArrowRight") {
                this.moveX = this.moveSpeed;
                this.direction = "right";
            } else if (e.code === "ArrowLeft") {
                this.moveX = -this.moveSpeed;
                this.direction = "left";
            } else if (e.code === "ArrowDown") {
                this.moveY = this.moveSpeed;
                this.direction = "down";
            } else if (e.code === "ArrowUp") {
                this.moveY = -this.moveSpeed;
                this.direction = "up";
            }
        })

        addEventListener("keyup", (e) => {
            if (e.code === "ArrowRight" && this.moveX === this.moveSpeed) {
                this.moveX = 0;
            }
            if (e.code === "ArrowLeft" && this.moveX === -this.moveSpeed) {
                this.moveX = 0;
            }
            if (e.code === "ArrowDown" && this.moveY === this.moveSpeed) {
                this.moveY = 0;
            }
            if (e.code === "ArrowUp" && this.moveY === -this.moveSpeed) {
                this.moveY = 0;
            }
        })
    }

    draw() {

        this.ctx.save();

        // move to the origin of our element
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // rotate around that point, converting our 
        // angle from degrees to radians

        switch (this.direction) {
            case "right":
                this.ctx.rotate((90 * Math.PI) / 180);
                break;
            case "left":
                this.ctx.rotate((270 * Math.PI) / 180);
                break;
            case "up":
                this.ctx.rotate((0 * Math.PI) / 180);
                break;
            case "down":
                this.ctx.rotate((180 * Math.PI) / 180);
                break;
        }

        // restore context to initial position
        this.ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);

        this.ctx.imageSmoothingEnabled = false;

        this.ctx.drawImage(this.player_sprite, this.x, this.y, this.width, this.height);

        // and restore the coords system
        this.ctx.restore();

        /* this.ctx.rect(this.player_hitbox.x + this.player_hitbox.offsetX, this.player_hitbox.y + this.player_hitbox.offsetY, this.player_hitbox.width, this.player_hitbox.height);
        this.ctx.strokeStyle = "red";
        this.ctx.stroke(); */
        

    }

    update() {
        if (this.move === this.moveDelay && (this.moveX != 0 || this.moveY != 0)) {
            if (this.direction === "right" || this.direction === "left") {
                this.x += this.moveX;
            } else {
                this.y += this.moveY;
            }
            this.move = 0;
            this.player_sprite = texture.sapo_verde_caminhar;
            setTimeout(() => {
                this.player_sprite = texture.sapo_verde;
            }, 250)
        }

        this.player_hitbox.x = this.x;
        this.player_hitbox.y = this.y;
        
        if (this.move < this.moveDelay) {
            this.move++;
        }

    }
}

export default Player;