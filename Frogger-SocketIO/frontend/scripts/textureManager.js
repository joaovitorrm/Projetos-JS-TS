import textures from "./textures.json" with {type: "json"}

class TextureManager {
    constructor() {
        this.textures = {};
    }
    setTexture(name) {
        this.textures[name] = loadTexture(name);
    }
    getTexture(name) {
        return this.textures[name];
    }
}

async function loadTexture(name) {
    return new Promise((resolve, reject) => {
        const texture = {
            image: "",
            width: 0,
            height: 0
        }

        const img = new Image();

        img.src = textures[name].path;

        img.onload = () => {
            img.width = textures[name].size.width;
            img.height = textures[name].size.height;

            texture.image = img;
            texture.width = textures[name].size.width;
            texture.height = textures[name].size.height;

            resolve(texture);
        };

        img.onerror = (error) => {
            reject("Erro ao carregar a imagem: " + error);
        };
    });
}


export default TextureManager;
