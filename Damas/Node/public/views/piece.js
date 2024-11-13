class Piece {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        // CRIA O ELEMENTO E ADICIONA A CLASSE NELE
        this.element = document.createElement("div");
        this.setClass();
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.setClass();
    }
    setClass() {
        this.element.className = `${this.color} x${this.x} y${this.y}`;
    }
}
export default Piece;
