class Piece {

    public x: number;
    public y: number;
    public type: string;
    public color: string;

    public element : HTMLDivElement;

    constructor(x: number, y: number, type: string, color: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;

        // CRIA O ELEMENTO E ADICIONA A CLASSE NELE
        this.element = document.createElement("div");
        this.setClass();
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.setClass();
    }

    setClass() {
        this.element.className = `${this.color} x${this.x} y${this.y}`;
    }
}

export default Piece;