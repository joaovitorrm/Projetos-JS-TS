class Player {

    inputs = [];

    controls = {
        "KeyA": () => this.move(-1, 0),
        "KeyW": () => this.move(0, -1),
        "KeyD": () => this.move(1, 0),
        "KeyS": () => this.move(0, 1)
    };

    player = {
        position: {x: 0, y: 0},
        size: 64,
        moveSpeed: 10,
        move: 10,
        inventory: {},
        current_lives: 2,
        max_lives: 3
    }

    map = {};
    parentFunctions = {"updateHealth": () => {}, "updateItens": () => {}};

    constructor(ctx) {
        this.ctx = ctx;

        addEventListener("keyup", (e) => {
            this.inputs.splice(this.inputs.indexOf(e.code), 1);
        })

        addEventListener("keydown", (e) => {
            if (this.controls[e.code] && !this.inputs.includes(e.code)) {
                this.inputs.unshift(e.code);
            }
        })
        
    };

    draw() {        
        this.ctx.beginPath();
        this.ctx.fillStyle = "cyan";
        this.ctx.fillRect(this.player.position.x, this.player.position.y, this.player.size, this.player.size);
        this.ctx.closePath();
    };

    update() {
        if (this.inputs.length > 0 && this.player.move === this.player.moveSpeed) {
            this.controls[this.inputs[0]]();
            this.player.move = 0;
        }

        if (this.player.move < this.player.moveSpeed) this.player.move++;
    };

    move(x, y) {
        this.player.position.x += this.player.size * x;
        this.player.position.y += this.player.size * y;

        if (!this.checkCollision(x, y)) {
            this.checkDevices();
            this.checkCollectables();
            this.checkDoors(x, y);
        }
    };

    checkCollision(x, y) {
        if (this.map.collisions[this.player.position.x] && this.map.collisions[this.player.position.x][this.player.position.y]) {
            this.player.position.x -= this.player.size * x;
            this.player.position.y -= this.player.size * y;
            return true;
        }
        return false;
    }

    checkCollectables() {
        for (const c of this.map.collectables) {
            if (c.x === this.player.position.x && c.y === this.player.position.y) {
                this.map.collectables.splice(this.map.collectables.indexOf(c), 1);
                if (c.id === "cr") {
                    if (this.player.current_lives < this.player.max_lives) {
                        this.player.current_lives++;
                        this.parentFunctions.updateHealth();
                        break;
                    }
                }
                this.player.inventory[c.id] = true;
                this.parentFunctions.updateItens();
                break;
            }
        }
    }

    checkDoors(x, y) {        
        for (const c of this.map.doors) {
            if (c.x === this.player.position.x && c.y === this.player.position.y) {
                if (Object.keys(this.player.inventory).length === 0) {
                    this.player.position.x -= this.player.size * x;
                    this.player.position.y -= this.player.size * y;
                    return;
                }
                for (const i in this.player.inventory) {
                    if (this.map.doorForKey[i] && this.map.doorForKey[i] === c.id) {
                        if (this.map.doorToLevel[c.id] != undefined) {
                            this.map.changeToLevel(this.map.doorToLevel[c.id]);
                            this.respawnPlayer();
                        }
                        return
                    };
                }
                this.player.position.x -= this.player.size * x;
                this.player.position.y -= this.player.size * y;
            }
        }
    }

    checkDevices() {
        for (const c of this.map.devices) {
            if (c.device.x === this.player.position.x && c.device.y === this.player.position.y) {
                this.takeDamage(c.type.damage)
            }
        }
    }

    takeDamage(amount) {
        if (this.player.current_lives > 0) {
            if (this.player.current_lives - amount < 0) {
                this.player.current_lives = 0;
            } else {
                this.player.current_lives--;
            }
            if (this.player.inventory["cr"]) {
                this.player.current_lives++;
                delete this.player.inventory["cr"];
                this.parentFunctions.updateItens();
            }
            this.parentFunctions.updateHealth();
        }
    }

    setMap(map) {
        this.map = map;
        this.respawnPlayer();
    }

    respawnPlayer() {
        this.player.position.x = this.map.playerSpawn.x;
        this.player.position.y = this.map.playerSpawn.y;
    }

}

export default Player;