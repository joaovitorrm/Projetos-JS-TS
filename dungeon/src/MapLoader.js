import levels from "./levels.json" with { type: "json" };
import Device from "./Devices.js";
import textures from "./Textures.js";

class MapLoader {

    level = 0;
    tileSize = 64;

    tiles = [];
    collisions = {};

    collectables = [];
    listOfCollectables = [];

    doors = [];
    listOfDoors = [];
    doorForKey = {};
    doorToLevel = {};

    devices = [];
    listOfDevices = [];

    loaded = false;
    playerSpawn = {x: 0, y: 0}

    constructor(ctx) {
        this.ctx = ctx;
    }

    draw() {
        if (!this.loaded) return;

        this.drawTiles(this.tiles);
        this.drawTiles(this.collectables);
        this.drawTiles(this.doors);
        
        for (const d of this.devices) {
            d.draw();
        }
    }

    drawTiles(arr) {
        for (const c of arr) {
            this.ctx.beginPath();
            if (c.hasImage) {
                this.ctx.drawImage(c.texture, c.x, c.y, 64, 64);
            } else {
                this.ctx.fillStyle = c.texture;
                this.ctx.fillRect(c.x, c.y, this.tileSize, this.tileSize);
            }
            this.ctx.closePath();
        }
    }

    changeToLevel(lvl) {
        this.level = lvl;

        this.tiles = [];
        this.collisions = {};

        this.collectables = [];
        this.listOfCollectables = [];

        this.doors = [];
        this.listOfDoors = [];
        this.doorForKey = {};
        this.doorToLevel = {};

        this.devices = [];
        this.listOfDevices = [];

        this.loadMap(lvl);
    }

    loadMap(lvl) {

        this.doorForKey = levels[lvl].doorForKey;
        this.doorToLevel = levels[lvl].doorToLevel;
        this.listOfCollectables.push(...levels[lvl].keys);
        this.listOfCollectables.push(...levels[lvl].collectables);
        this.listOfDevices.push(...levels[lvl].devices);
        this.listOfDoors.push(...levels[lvl].doors);

        levels[lvl].tiles.forEach((y, j) => {
            const posY = j * this.tileSize;

            let k = -1;
            for (const x of y) {
                k++;
                const posX = k * this.tileSize;

                if (x === "w") {
                    if (!this.collisions[posX]) this.collisions[posX] = {};
                    this.collisions[posX][posY] = true;
                };

                if (x === "p") {
                    this.playerSpawn.x = posX;
                    this.playerSpawn.y = posY;
                    this.tiles.push({x: posX, y: posY, texture: textures[" "], hasImage: false});
                    continue;
                }
                if (this.listOfDevices.includes(x)) {
                    this.devices.push(new Device(this.ctx, "ground_spikes", posX, posY));
                }

                if (textures[x]) {                
                    if (this.listOfCollectables.includes(x)) {
                        this.collectables.push({x: posX, y: posY, texture: textures[x], id: x, hasImage: typeof textures[x] === 'string' ? false : true});
                        this.tiles.push({x: posX, y: posY, texture: textures[" "], hasImage: false});
                        continue;
                    }
                    if (this.listOfDoors.includes(x)) {
                        this.doors.push({x: posX, y: posY, texture: textures[x], id: x, hasImage: typeof textures[x] === 'string' ? false : true});
                        continue;
                    }                    
                    this.tiles.push({x: posX, y: posY, texture: textures[x], hasImage: typeof textures[x] === 'string' ? false : true});
                    continue;
                }
                this.tiles.push({x: posX, y: posY, texture: textures["notFound"], hasImage: false});
            }
        })
        this.loaded = true;
    }
}

export default MapLoader;