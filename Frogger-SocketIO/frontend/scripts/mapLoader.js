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
        ],
        "grama": [
            "grama"
        ]
    }

    map_entities = {
        "areia": [
            "sand_castle",
            "ball"
        ],
        "agua": [
            "log",
            "smallLog",
            "lilypad"
        ],
        "estrada": [
            "car"
        ],
        "grama": [
            "bush"
        ]
    }

    map_configs = {
        "estrada": {
            spawnCooldown: 120
        },
        "agua": {
            spawnCooldown: 60
        }
    }

    map_y = 0;
    scrollY = 0;    
    maxSpawnTime = Math.max.apply(0, Object.values(this.map_configs).map(e => e.spawnCooldown));    
    spawnTime = this.maxSpawnTime;

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

        this.entityRespawnSpeed = 80;
        this.entityAtcualRespawn = 0;
    }

    increaseScrollY(amount) {
        this.scrollY += amount;
    }

    getLastMapY() {
        return this.scrollY + this.map_y;
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
            this.ctx.drawImage(m.texture[m.stage].image, 0, m.y + this.scrollY, m.texture[m.stage].width, m.texture[m.stage].height);
        }
        this.isUpdateTexture = false;

        this.entity.draw(this.scrollY);
    }

    update() {
        if (this.textureAnimationSpeed > this.textureActualSpeed) {
            this.textureActualSpeed++;
        } else {
            this.isUpdateTexture = true;
        }

        this.spawnTime++;
        if (this.spawnTime > this.maxSpawnTime) {
            this.spawnTime = 0;
        }

        this.maps.forEach((e) => {
            if (e.config === "" || !this.map_configs[e.type]) return;

            if (e.y + e.texture[0].height + this.scrollY > 0 && e.y + this.scrollY < this.canvas.height) {
                if (this.spawnTime % this.map_configs[e.type].spawnCooldown === 0) {                
                    this.generateRandomEntity(e, 1);
                }
            }
        })

        this.entity.update();

        this.entity.entities.forEach((e, i) => {

            if (e.y + this.scrollY + e.texture.height > this.canvas.height){
                this.entity.entities.splice(i, 1);
            }
            if (e.config.direction) {
                if (e.config.direction === "right" && e.x > this.canvas.width ||
                    e.config.direction === "left" && e.x + e.texture.width < 0                    
                ) {
                    this.entity.entities.splice(i, 1);
                }
            }
            
        })

        console.log(this.entity.entities)
    }

    async generateSpecificMapFromMapName(mapName) {
        const map = {}

        const textures = [];

        textures.push(await this.textureManager.setTexture(mapName));

        this.map_y -= textures[0].height;

        map["texture"] = textures;
        map["y"] = this.map_y;
        map["stage"] = 0;
        map["length"] = textures.length;
        map["type"] = mapName;
        map["config"] = this.map_configs[mapName] || "";

        this.maps.push(map);

        return map;
    }

    async generateSpecificMap(map_type) {

        const map = {}

        const textures = [];

        for (let i = 0; i < this.maps_types[map_type].length; i++)
            textures.push(await this.textureManager.setTexture(this.maps_types[map_type][i]));

        this.map_y -= textures[0].height;

        map["texture"] = textures;
        map["y"] = this.map_y;
        map["stage"] = 0;
        map["length"] = textures.length;
        map["type"] = map_type;
        map["config"] = this.map_configs[map_type] || "";

        this.maps.push(map);

        return map;
    }

    async generateRandomMap() {

        const map = {}

        const keys = Object.keys(this.maps_types);

        const randomMap = keys[Math.floor(Math.random() * keys.length)];

        const textures = [];

        for (let i = 0; i < this.maps_types[randomMap].length; i++) {
            textures.push(await this.textureManager.setTexture(this.maps_types[randomMap][i]));
        }

        this.map_y -= textures[0].height;

        map["texture"] = textures;
        map["y"] = this.map_y;
        map["stage"] = 0;
        map["length"] = textures.length;
        map["type"] = randomMap;
        map["config"] = this.map_configs[randomMap] || "";

        this.maps.push(map);

        return map;
    }

    async generateRandomEntity(map, amount) {

        if (!this.map_entities[map.type]) return;

        if (map.length > 0) {
            for (let i = 0; i < amount; i++) {

                const entityType = this.map_entities[map.type][Math.floor(Math.random() * this.map_entities[map.type].length)];

                let createdEntity;
                let posX;
                let posY;

                let dir;

                switch (entityType) {
                    case "car":
                        dir = Math.floor(Math.random() * 2) === 1 ? "right" : "left";

                        createdEntity = await this.entity.createEntity(entityType, { direction: dir });

                        posX = dir === "right" ?
                            -createdEntity.texture.width - (i * createdEntity.texture.width) :
                            map.texture[0].width + (i * createdEntity.texture.width);
                        posY = dir === "right" ? map.y + 180 : map.y;

                        createdEntity.setPosition(posX, posY);
                        break;
                    case "smallLog":
                        dir = Math.floor(Math.random() * 2) === 1 ? "right" : "left";

                        createdEntity = await this.entity.createEntity(entityType, { direction: dir });

                        posX = dir === "right" ?
                            -createdEntity.texture.width - (i * createdEntity.texture.width) :
                            map.texture[0].width + (i * createdEntity.texture.width);
                        posY = dir === "right" ? map.y + 60 : map.y;

                        createdEntity.setPosition(posX, posY);
                        break;
                    case "log":
                        dir = Math.floor(Math.random() * 2) === 1 ? "right" : "left";

                        createdEntity = await this.entity.createEntity(entityType, { direction: dir });

                        posX = dir === "right" ?
                            -createdEntity.texture.width - (i * createdEntity.texture.width) :
                            map.texture[0].width + (i * createdEntity.texture.width);
                        posY = dir === "right" ? map.y + 60 : map.y;

                        createdEntity.setPosition(posX, posY);
                        break;
                    case "lilypad":

                        posX = ((Math.floor(Math.random() * (map.texture[0].width / 60)) * 60));
                        posY = map.y + 120;

                        let copy = this.entity.entities.find(e => (e.x === posX && e.y === posY));
                        if (copy) {
                            return;
                        }

                        createdEntity = await this.entity.createEntity(entityType, {});
                        createdEntity.setPosition(posX, posY);
                        break;
                    case "ball":
                        createdEntity = await this.entity.createEntity(entityType);
                        createdEntity.setPosition(
                            ((Math.floor(Math.random() * ((map.texture[0].width / 60) - createdEntity.texture.width / 60)) * 60) + 10),
                            ((map.y + Math.floor(Math.random() * map.texture[0].height / 60) * 60) + 10));
                        break;
                    default:
                        createdEntity = await this.entity.createEntity(entityType, { direction: "left", size: "small" });
                        createdEntity.setPosition(
                            (Math.floor(Math.random() * ((map.texture[0].width / 60) - createdEntity.texture.width / 60 + 1)) * 60),
                            (map.y + Math.floor(Math.random() * map.texture[0].height / 60) * 60));
                        break;
                }
            }
        }
    }
}

export default MapLoader;