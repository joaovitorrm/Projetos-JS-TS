import TextureManager from "./textureManager.js";
import Entity from "./entity.js";

class MapLoader {
    maps_types = {
        "areia": [
            "areia"
        ],
        "agua": [
            "agua",
            "agua_movimento",
        ],
        "estrada": [
            "estrada_fudida"
        ]
    }

    map_entities = {
        "areia": [
            "sand_castle",
            "ball"
        ],
        "agua": [
            "log",
            "lilypad"
        ],
        "estrada": [
            "car"
        ]
    }

    map_y = 0;

    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.textureManager = new TextureManager();
        this.entity = new Entity(ctx);

        this.map_y = canvas.height;

        this.maps = [];

        this.textureAnimationSpeed = 30;
        this.textureActualSpeed = 0;
        this.isUpdateTexture = false;

        for (let i = 0; i < 5; i++) {
            this.generateRandomMap();
        }
    }

    draw() {
        for (const m of this.maps) {
            if (this.isUpdateTexture) {
                m.stage++;
                if (m.stage === m.length) {
                    m.stage = 0;
                }
                this.textureActualSpeed = 0;
            }
            this.ctx.drawImage(m.texture[m.stage].image, 0, m.y, m.texture[m.stage].width, m.texture[m.stage].height);
        }
        this.isUpdateTexture = false;

        this.entity.draw();
    }

    update() {
        if (this.textureAnimationSpeed > this.textureActualSpeed) {
            this.textureActualSpeed++;
        } else {
            this.isUpdateTexture = true;
        }
        this.entity.update();
    }

    async generateRandomMap() {

        const map = {}

        const keys = Object.keys(this.maps_types);

        const randomMap = keys[Math.floor(Math.random() * keys.length)];

        let textures = [];

        for (let i = 0; i < this.maps_types[randomMap].length; i++) {
            textures.push(await this.textureManager.setTexture(this.maps_types[randomMap][i]));
        }

        /* const createdEntity = await this.entity.createEntity(this.map_entities[randomMap][Math.floor(Math.random() * this.map_entities[randomMap].length)], { direction: "right", size: "small" });

        createdEntity.setPosition(
            Math.floor(Math.random() * ((this.canvas.width / 60) - createdEntity.texture.width / 60)) * 60,
            Math.floor(Math.random() * ((this.canvas.height / 60) - createdEntity.texture.height / 60)) * 60);
 */
        this.map_y -= textures[0].height;

        map["texture"] = textures;
        map["y"] = this.map_y;
        map["stage"] = 0;
        map["length"] = textures.length;
        map["type"] = randomMap;

        this.maps.push(map);
    }
}

export default MapLoader;