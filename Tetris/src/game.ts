import config from "./config.js";
import Piece from "./pieces.js";
import UI from "./UI.js";
import { getRandomFormat } from "./pieces.js";

const canvas : HTMLCanvasElement = document.querySelector(".game-container") as HTMLCanvasElement;
const ctx : CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

class Game {

    actualPiece : Piece;
    ui : UI;
    grid : string[][];
    running : boolean;
    nextPieces : Piece[] = [];

    constructor() { 

        this.ui = new UI;        

        this.grid = this.createGrid();

        this.actualPiece = this.createNewPiece();

        this.createNextPieces();

        addEventListener("keydown", (e) => {
            this.actualPiece?.handleKeyDown(e)
        });
        addEventListener("keyup", (e) => {
            this.actualPiece?.handleKeyUp(e)
        });

        this.running = true;
    }

    createNextPieces() {
        while (this.nextPieces.length < 4) {
            let newPiece = this.createNewPiece()
            this.nextPieces.push(newPiece);
            this.ui.addNextPiece(newPiece.color, newPiece.actualFormat);
        }
    }

    createGrid() : string[][] {
        return Array.from({length : config.BOARD_HEIGHT}, () => Array(config.BOARD_WIDTH).fill(""))
    }

    createNewPiece() : Piece {
        let newPiece = new Piece(3, 4, getRandomFormat());        
        return newPiece;
    }

    draw(ctx : CanvasRenderingContext2D) : void {        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ui.draw(ctx);
        this.actualPiece.draw(ctx);
        this.drawGrid();
        this.drawGridLines();
    }

    drawGrid() : void {
        this.grid.forEach((col, y) => {
            col.forEach((row, x) => {
                if (row != "") {
                    ctx.fillStyle = row;
                    ctx.fillRect(x * this.actualPiece.size, (y + 6) * this.actualPiece.size, this.actualPiece.size, this.actualPiece.size);
                }
            })
        })
    }

    drawGridLines() {
        ctx.lineWidth = 1;
        for (let x = 1; x < config.BOARD_WIDTH + 1; x++) {            
            ctx.beginPath();
            ctx.moveTo(x*config.PIECE_SIZE, config.SCREEN_HEIGHT-config.BOARD_HEIGHT*config.PIECE_SIZE);
            ctx.lineTo(x*config.PIECE_SIZE, config.SCREEN_HEIGHT);
            if (x === config.BOARD_WIDTH) {
                ctx.strokeStyle = "hsl(0, 0%, 30%)";
            } else {
                ctx.strokeStyle = "hsl(0, 0%, 5%)";
            }
            
            ctx.stroke();
        }

        for (let y = 1; y < config.BOARD_HEIGHT +1; y++) {
            ctx.beginPath();
            ctx.moveTo(0, config.SCREEN_HEIGHT - y*config.PIECE_SIZE);
            ctx.lineTo(config.BOARD_WIDTH*config.PIECE_SIZE, config.SCREEN_HEIGHT - y*config.PIECE_SIZE);
            if (y === config.BOARD_HEIGHT) {
                ctx.strokeStyle = "hsl(0, 0%, 30%)";
            } else {
                ctx.strokeStyle = "hsl(0, 0%, 5%)";
            }
            ctx.stroke();
        }
    }

    checkPieceCollision() : boolean {
        for (const col of this.actualPiece.collisions) {
            if (this.actualPiece.y - 6 + col[1] >= 0) {
                if (this.grid[this.actualPiece.y - 6 + col[1]][this.actualPiece.x + col[0]] != "") {
                    return true;
                }
            }
        }
        return false;
    }

    checkPiecesCollisions() {
        if (this.checkPieceCollision()) {
            if (this.actualPiece.move != 0) {
                this.actualPiece.x -= this.actualPiece.move;
            } else {
                this.actualPiece.y--;
                this.actualPiece.canMove = false;
            }
        }
    }

    gravityMovement() {
        if (this.actualPiece.actualGravitySpeed >= this.actualPiece.gravitySpeed) {
            this.actualPiece.y++;
            this.actualPiece.actualGravitySpeed = 0;
        }

        if (this.actualPiece.actualGravitySpeed < this.actualPiece.gravitySpeed) {
            this.actualPiece.actualGravitySpeed++;
        }
    }

    horizontalMovement() {
        if (this.actualPiece.actualMoveSpeed === this.actualPiece.moveSpeed && this.actualPiece.move != 0) {
            this.actualPiece.x += this.actualPiece.move;
            this.actualPiece.actualMoveSpeed = 0;
        }

        if (this.actualPiece.actualMoveSpeed < this.actualPiece.moveSpeed) {
            this.actualPiece.actualMoveSpeed++;
        }
    }

    checkScreenCollisions() {
        for (const pos of this.actualPiece.collisions) {
            if (pos[1] + this.actualPiece.y >= config.SCREEN_HEIGHT/config.PIECE_SIZE) {
                this.actualPiece.y--;
                this.actualPiece.canMove = false;
            }

            if (pos[0] + this.actualPiece.x < 0 || pos[0] + this.actualPiece.x + 1 > config.BOARD_WIDTH) {
                this.actualPiece.x -= this.actualPiece.move;
            }
        }
    }

    checkIsAlive() {
        if (!this.actualPiece.canMove) {
            for (const col of this.actualPiece.collisions) {
                if (!this.grid[this.actualPiece.y - 6 + col[1]]) {
                    this.running = false;
                    return;
                }
                this.grid[this.actualPiece.y - 6 + col[1]][this.actualPiece.x + col[0]] = this.actualPiece.color;
            }
            this.actualPiece = this.createNewPiece();
        }
    }

    checkScored() {
        let gridCopy = [...this.grid];
        gridCopy.forEach((col, y) => {
            if (col.every(e => e != "")) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(config.BOARD_WIDTH).fill(""))
            }
        })
    }

    update() : void {
        if (!this.running) return;

        // MOVES PLAYER DOWN
        this.gravityMovement();

        // MOVES PLAYER WITH A AND D
        this.horizontalMovement();

        // CHECK OUT OF BOUNDS
        this.checkScreenCollisions();        

        // IF IT HITS SOMETHING CREATE A NEW ONE
        this.checkIsAlive();

        // CHECK IF IT HIT ANOTHER PIECE
        this.checkPiecesCollisions();

        // CLEARS THE LINES THAT HAVE BEEN FILLED
        this.checkScored();
        
    }
}

const main = () => {

    canvas.width = config.SCREEN_WIDTH;
    canvas.height = config.SCREEN_HEIGHT;

    const game = new Game();

    const run = () => {

        game.update();
        game.draw(ctx);

        requestAnimationFrame(run)
    }

    requestAnimationFrame(run)
}

main()