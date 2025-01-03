import devices from "./devices_types.json" with {type: "json"};

class Device {

    ctx;

    device = {
        x: 0,
        y: 0
    }

    type = {};

    constructor(ctx, type, x, y) {
        this.ctx = ctx;
        this.type = devices[type];
        this.device.x = x;
        this.device.y = y;

        const texture = new Image;
        texture.src = this.type.texturePath;
        this.type.texture = texture;
    };

    draw() {
        this.ctx.drawImage(this.type.texture, this.device.x, this.device.y);
    };

    update() {};
}

export default Device;