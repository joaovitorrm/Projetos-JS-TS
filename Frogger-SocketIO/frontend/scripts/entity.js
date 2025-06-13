import TextureManager from "./textureManager.js";

class Entity {
    entities = [];
    ctx;
    types = {
        "log": {
            "classType": Log,
            "texture": "tora"
        },
        "smallLog" : {
            "classType": SmallLog,
            "texture": "torinha"
        },
        "car": {
            "classType": Car,
            "texture": "carro"
        },
        "ball": {
            "classType": Ball,
            "texture": "bola_volei"
        },
        "sand_castle": {
            "classType": Castle,
            "texture": "castelo_areia"
        },
        "lilypad": {
            "classType": Lilypad,
            "texture": "derrota_aiger"
        },
        "bush": {
            "classType": Bush,
            "texture": "arbusto"
        }
    }

    textureManager = new TextureManager();

    constructor(ctx) {
        this.ctx = ctx;
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    async createEntity(type, config={}) {
        const newEntity = new this.types[type]["classType"](this.ctx, await this.loadTexture(type), config);
        this.addEntity(newEntity);
        return newEntity;
    }

    async loadTexture(type) {
        return await this.textureManager.setTexture(this.types[type].texture);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(offsetY) {
        this.entities.forEach(e => e.draw(offsetY));
    }

    update() {
        this.entities.forEach(e => e.update());
    }
}

class Lilypad extends Entity {
    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
    }

    update() {}

    draw(offsetY) {
        this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
    }
}

class Bush extends Entity {
    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
    }

    update() {}

    draw(offsetY) {
        this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
    }
}

class SmallLog extends Entity {
    directions = {
        "left": () => { this.x -= 60 },
        "right": () => { this.x += 60 }
    }

    maxSpeed = 20;
    speed = 0;

    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
        this.x = 0;
        this.y = 0;
    }

    update() {
        this.speed++;

        if (this.speed >= this.maxSpeed) {
            this.directions[this.config.direction].bind(this)();
            this.speed = 0;
        }
    }

    draw(offsetY) {
        this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
    }
}

class Log extends Entity {
    directions = {
        "left": () => { this.x -= 60 },
        "right": () => { this.x += 60 }
    }

    maxSpeed = 20;
    speed = 0;

    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
    }

    update() {
        this.speed++;

        if (this.speed >= this.maxSpeed) {
            this.directions[this.config.direction].bind(this)();
            this.speed = 0;
        }
    }

    draw(offsetY) {
        this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
    }
}

class Ball extends Entity {
    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
    }

    update(){
        
    }

    draw(offsetY){
        this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
    }
}

class Castle extends Entity{
    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
    }

    update(){
        
    }

    draw(offsetY){
        this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
    }
}
class Car extends Entity {
    directions = {
        "left": () => { this.x -= 60 },
        "right": () => { this.x += 60 }
    }

    maxSpeed = 20;
    speed = 0;

    constructor(ctx, texture, config) {
        super(ctx);
        this.ctx = ctx;
        this.texture = texture;
        this.config = config;
    }

    update() {
        this.speed++;

        if (this.speed >= this.maxSpeed) {
            this.directions[this.config.direction].bind(this)();
            this.speed = 0;
        }
        
    }

    draw(offsetY) {
        this.ctx.save();

        // move to the origin of our element
        this.ctx.translate(this.x + this.texture.width / 2, this.y + this.texture.height / 2);

        // rotate around that point, converting our 
        // angle from degrees to radians

        if (this.config.direction === "right") {
            this.ctx.rotate((180 * Math.PI) / 180);
        }

        // restore context to initial position
        this.ctx.translate(-this.x - this.texture.width / 2, -this.y - this.texture.height / 2);

        if (this.config.direction === "right") {
            this.ctx.drawImage(this.texture.image, this.x, this.y - offsetY, this.texture.width, this.texture.height);
        } else {
            this.ctx.drawImage(this.texture.image, this.x, this.y + offsetY, this.texture.width, this.texture.height);
        }

        // and restore the coords system
        this.ctx.restore();
        
    }
}



export default Entity