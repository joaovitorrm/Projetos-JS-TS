import config from "./config.js";

class UI {

    pieces : {color : string, format : string[][]}[] = [];

    addNextPiece(color : string, format : string[][]) {
        if (this.pieces.length > 4) this.pieces.shift();
        this.pieces.push({color: color, format: format});        
    }

    get2x2PieceCenter(initialPosX : number, initialPosY : number) : [number, number, number, number] {
        return [(initialPosX+1) * config.PIECE_SIZE, (initialPosY+1) * config.PIECE_SIZE, config.PIECE_SIZE, config.PIECE_SIZE];
    }

    get3x3PieceCenter(initialPosX : number, initialPosY : number) : [number, number, number, number] {
        return [(initialPosX) * config.PIECE_SIZE + config.PIECE_SIZE / 2, (initialPosY) * config.PIECE_SIZE + config.PIECE_SIZE / 2, config.PIECE_SIZE, config.PIECE_SIZE];
    }

    get4x4PieceCenter(initialPosX : number, initialPosY : number) : [number, number, number, number] {
        return [(initialPosX) * config.PIECE_SIZE + config.PIECE_SIZE / 2, (initialPosY) * config.PIECE_SIZE, config.PIECE_SIZE, config.PIECE_SIZE];
    }

    drawNext(ctx : CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.strokeStyle = "hsl(0, 0%, 20%)"
        ctx.lineWidth = 3;
        ctx.roundRect(12 * config.PIECE_SIZE, 1 * config.PIECE_SIZE, 4 * config.PIECE_SIZE, 4 * config.PIECE_SIZE, 5)
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = this.pieces[0].color;
        this.pieces[0].format.forEach((col, y) => {
            col.forEach(((row, x) => {
                if (row === "x") {
                    if (col.length === 2) {
                        ctx.fillRect(...this.get2x2PieceCenter(12+x, 1+y))
                    } else if (col.length === 3) {
                        ctx.fillRect(...this.get3x3PieceCenter(12+x, 1+y))
                    } else {
                        ctx.fillRect(...this.get4x4PieceCenter(12+x, 1+y))
                    }
                    ctx.stroke();
                }
            }))
        })
    }

    drawNexts(ctx : CanvasRenderingContext2D) {
        for (let c = 0; c < 3; c++) {
            ctx.beginPath()
            ctx.strokeStyle = "hsl(0, 0%, 20%)"
            ctx.lineWidth = 3;
            ctx.roundRect(12 * config.PIECE_SIZE, (c*4 + 6) * config.PIECE_SIZE, 4 * config.PIECE_SIZE, 4 * config.PIECE_SIZE, 5)
            ctx.stroke();
            ctx.closePath();

            ctx.fillStyle = this.pieces[c+1].color;
            this.pieces[c+1].format.forEach((col, y) => {
                col.forEach(((row, x) => {
                    if (row === "x") {
                        if (col.length === 2) {
                            ctx.fillRect(...this.get2x2PieceCenter(12+x, (c*4 + 6)+y))
                        } else if (col.length === 3) {
                            ctx.fillRect(...this.get3x3PieceCenter(12+x, (c*4 + 6)+y))
                        } else {
                            ctx.fillRect(...this.get4x4PieceCenter(12+x, (c*4 + 6)+y))
                        }
                        ctx.stroke();
                    }
                }))
            })

        }
    }

    draw(ctx : CanvasRenderingContext2D) {
        
        this.drawNext(ctx);
        
        this.drawNexts(ctx);
    }
}

export default UI;