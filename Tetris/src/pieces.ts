import config from "./config.js";

type piecesType = {
    [key: string]: string[][]
}

type piecesColors = {
    [key: string]: string
}

const pieces : piecesType = {
    'l': [
        [" ","x"," "],
        [" ","x"," "],
        [" ","x","x"]
    ],
    "j": [
        [" ","x"," "],
        [" ","x"," "],
        ["x","x"," "]
    ],
    "o": [
        ["x","x"],
        ["x","x"]
    ],
    "t": [
        [" "," "," "],
        [" ","x"," "],
        ["x","x","x"]
    ],
    "s": [
        [" "," "," "],
        [" ","x","x"],
        ["x","x"," "]
    ],
    "z": [
        [" "," "," "],
        ["x","x"," "],
        [" ","x","x"]
    ],
    "i": [
        [" ","x"," "," "],
        [" ","x"," "," "],
        [" ","x"," "," "],
        [" ","x"," "," "],
    ]
}

const piecesColors : piecesColors  = {
    "l": "orange",
    "j": "purple",
    "s": "red",
    "z": "green",
    "o": "yellow",
    "i": "cyan",
    "t": "blue"
}

const rotate : {[key: string] : number[][]} = {
    "4x4" : [
        [3, 0], [2, 0], [1, 0], [0, 0],
        [3, 1], [2, 1], [1, 1], [0, 1],
        [3, 2], [2, 2], [1, 2], [0, 2],
        [3, 3], [2, 3], [1, 3], [0, 3],
    ],
    "3x3" : [
        [2, 0], [1, 0], [0, 0],
        [2, 1], [1, 1], [0, 1],
        [2, 2], [1, 2], [0, 2]
    ]
}

export function getRandomFormat() : string {
    return Object.keys(piecesColors)[Math.floor(Math.random() * Object.keys(piecesColors).length)];
}

class Piece {

    x : number;
    y : number;
    type : string;
    color : string;
    collisions : number[][];
    size : number = config.PIECE_SIZE;
    actualFormat : string[][] = [];
    canMove : boolean = true;
    move : number = 0;
    moveSpeed : number = config.MOVE_SPEED;
    actualMoveSpeed : number = config.MOVE_SPEED;
    gravitySpeed : number = config.GRAVITY_SPEED;
    actualGravitySpeed : number = 0;

    constructor(x : number, y : number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = piecesColors[type];
        this.collisions = this.createCollisions(pieces[type]);
        this.actualFormat = pieces[type];
    }

    handleKeyUp = (e : KeyboardEvent) => {
        if (this.move === 1 && e.code === "KeyD" || this.move === -1 && e.code === "KeyA") {
            this.move = 0;
        }
        else if (e.code === "KeyS") this.gravitySpeed = config.GRAVITY_SPEED;
    }

    handleKeyDown = (e : KeyboardEvent) => {
        if (e.code === "KeyD") this.move = 1;

        else if (e.code === "KeyA") this.move = -1;

        else if (e.code === "KeyS") this.gravitySpeed = 3;

        else if (e.code === "KeyW")  {
            let format = ""; let size = 0;

            if (this.actualFormat.length === 4) {format = "4x4"; size = 4}
            else if (this.actualFormat.length === 3) {format = "3x3"; size = 3}

            let actualFormat = this.actualFormat.map(row => [...row]);
            rotate[format].forEach((p, i) => {
                actualFormat[(i - i%size) / size][i%size] = this.actualFormat[p[0]][p[1]]
            })

            this.actualFormat = actualFormat;
            this.collisions = this.createCollisions(actualFormat);
        }
    }

    rotatePiece() {
        console.log("A")
        
    }

    createCollisions(pieceType : string[][]) {
        const collisions : number[][] = [];
        pieceType.forEach((column, y) => {
            column.forEach((row, x) => {
                if (row === "x") {
                    collisions.push([x, y])
                }
            })
        })
        return collisions;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        for (const pos of this.collisions) {
            ctx.fillRect((pos[0]+this.x)*this.size, (pos[1]+this.y)*this.size, this.size, this.size);
        }
    }
}

export default Piece;