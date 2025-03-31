class Entity {

    types = {
        "wood": () => {}
    }

    constructor(ctx) {
        this.ctx = ctx;
        this.entities = {};
    }

    createEntity(type, texture, posx, posy) {
        this.texture = texture;

    }

    draw() {
        for (const e in this.entities)
            this.entities[e].draw();
    }

    update() {
        for (const e in this.entities)
            this.entities[e].update();
    }
}


class Wood extends Entity {
    directions = {
        "left" : () => {this.x -= 5},
        "right": () => {this.x += 5}
    }

    constructor(ctx, texture, posx, posy, direction) {
        super(ctx);
        this.x = posx;
        this.y = posy;
        this.direction = direction;
        this.ctx = ctx;
        this.texture = texture;
    }

    update() {
        this.directions[this.direction].bind(this);
    }

    draw() {
        this.ctx.drawImage(this.texture.image, this.x, this.y, this.texture.width, this.texture.height);
    }
}

export default Entity;