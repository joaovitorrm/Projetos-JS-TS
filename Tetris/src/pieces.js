import config from "./config.js";
const pieces = {
    'l': [
        [" ", "x", " "],
        [" ", "x", " "],
        [" ", "x", "x"]
    ],
    "j": [
        [" ", "x", " "],
        [" ", "x", " "],
        ["x", "x", " "]
    ],
    "o": [
        ["x", "x"],
        ["x", "x"]
    ],
    "t": [
        [" ", " ", " "],
        [" ", "x", " "],
        ["x", "x", "x"]
    ],
    "s": [
        [" ", " ", " "],
        [" ", "x", "x"],
        ["x", "x", " "]
    ],
    "z": [
        [" ", " ", " "],
        ["x", "x", " "],
        [" ", "x", "x"]
    ],
    "i": [
        [" ", "x", " ", " "],
        [" ", "x", " ", " "],
        [" ", "x", " ", " "],
        [" ", "x", " ", " "],
    ]
};
const piecesColors = {
    "l": "orange",
    "j": "purple",
    "s": "red",
    "z": "green",
    "o": "yellow",
    "i": "cyan",
    "t": "blue"
};
const rotate = {
    "4x4": [
        [3, 0], [2, 0], [1, 0], [0, 0],
        [3, 1], [2, 1], [1, 1], [0, 1],
        [3, 2], [2, 2], [1, 2], [0, 2],
        [3, 3], [2, 3], [1, 3], [0, 3],
    ],
    "3x3": [
        [2, 0], [1, 0], [0, 0],
        [2, 1], [1, 1], [0, 1],
        [2, 2], [1, 2], [0, 2]
    ]
};
export function getRandomFormat() {
    return Object.keys(piecesColors)[Math.floor(Math.random() * Object.keys(piecesColors).length)];
}
class Piece {
    constructor(x, y, type) {
        this.size = config.PIECE_SIZE;
        this.actualFormat = [];
        this.canMove = true;
        this.move = 0;
        this.moveSpeed = config.MOVE_SPEED;
        this.actualMoveSpeed = config.MOVE_SPEED;
        this.gravitySpeed = config.GRAVITY_SPEED;
        this.actualGravitySpeed = 0;
        this.handleKeyUp = (e) => {
            if (this.move === 1 && e.code === "KeyD" || this.move === -1 && e.code === "KeyA") {
                this.move = 0;
            }
            else if (e.code === "KeyS")
                this.gravitySpeed = config.GRAVITY_SPEED;
        };
        this.handleKeyDown = (e) => {
            if (e.code === "KeyD")
                this.move = 1;
            else if (e.code === "KeyA")
                this.move = -1;
            else if (e.code === "KeyS")
                this.gravitySpeed = 3;
            else if (e.code === "KeyW") {
                let format = "";
                let size = 0;
                if (this.actualFormat.length === 4) {
                    format = "4x4";
                    size = 4;
                }
                else if (this.actualFormat.length === 3) {
                    format = "3x3";
                    size = 3;
                }
                let actualFormat = this.actualFormat.map(row => [...row]);
                rotate[format].forEach((p, i) => {
                    actualFormat[(i - i % size) / size][i % size] = this.actualFormat[p[0]][p[1]];
                });
                this.actualFormat = actualFormat;
                this.collisions = this.createCollisions(actualFormat);
            }
        };
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = piecesColors[type];
        this.collisions = this.createCollisions(pieces[type]);
        this.actualFormat = pieces[type];
    }
    rotatePiece() {
        console.log("A");
    }
    createCollisions(pieceType) {
        const collisions = [];
        pieceType.forEach((column, y) => {
            column.forEach((row, x) => {
                if (row === "x") {
                    collisions.push([x, y]);
                }
            });
        });
        return collisions;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        for (const pos of this.collisions) {
            ctx.fillRect((pos[0] + this.x) * this.size, (pos[1] + this.y) * this.size, this.size, this.size);
        }
    }
}
export default Piece;
