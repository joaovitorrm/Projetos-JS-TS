import TextureManager from "./textureManager.js";

class Entity {
    entities = [];
    ctx;
    types = {
        "log": Log,
        "car": Car,
        "ball": Ball,
        "sand_castle": Castle,
        "lilypad": Lilypad
    }

    textureManager = new TextureManager();

    constructor(ctx) {
        this.ctx = ctx;
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    async createEntity(type, config) {
        const newEntity = await new this.types[type]();
        this.addEntity(await newEntity.loadEntity(config));
        return newEntity;
    }

    draw() {
        this.entities.forEach(e => e.draw(this.ctx));
    }

    update() {
        this.entities.forEach(e => e.update());
    }
}

class Lilypad extends Entity {
    async loadEntity(config={}) {
        this.texture = await this.textureManager.setTexture("derrota_aiger");
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {}

    draw(ctx) {
        ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
    }
}

class Log extends Entity {
    directions = {
        "left": () => { this.x -= 0 },
        "right": () => { this.x += 0 }
    }

    async loadEntity(config) {
        this.direction = config.direction;
        if (config.size === "small") {
            this.texture = await this.textureManager.setTexture("torinha");
            return this;

        } else if (config.size === "medium") {
            this.texture = await this.textureManager.setTexture("tora")
            return this;
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.directions[this.direction].bind(this)();
    }

    draw(ctx) {
        ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
    }
}

class Ball extends Entity {
    async loadEntity(config) {
        this.direction = config.direction;
        this.texture = await this.textureManager.setTexture("bola_volei");
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update(){
        
    }
    draw(ctx){
        ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
    }
}

class Castle extends Entity{
    async loadEntity(config) {
        this.direction = config.direction;
        this.texture = await this.textureManager.setTexture("castelo_areia");
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update(){
        
    }
    draw(ctx){
        ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
    }
}
class Car extends Entity {
    directions = {
        "left": () => { this.x -= 1 },
        "right": () => { this.x += 1 }
    }

    async loadEntity(config) {
        this.direction = config.direction;
        this.texture = await this.textureManager.setTexture("carro");
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.directions[this.direction].bind(this)();
    }

    draw(ctx) {
        ctx.save();

        // move to the origin of our element
        ctx.translate(this.x + this.texture.width / 2, this.y + this.texture.height / 2);

        // rotate around that point, converting our 
        // angle from degrees to radians

        if (this.direction === "right") {
            ctx.rotate((180 * Math.PI) / 180);
        }

        // restore context to initial position
        ctx.translate(-this.x - this.texture.width / 2, -this.y - this.texture.height / 2);

        ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);

        // and restore the coords system
        ctx.restore();
    }
}



export default Entity