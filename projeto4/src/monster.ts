export default class Monster {
    private canvas : HTMLCanvasElement;
    private x : number;
    private y : number;

    private radius : number = 50;

    private speed : number = 3;
    private movingSpeed : number = 3;

    private health : number = 150;

    constructor(canvas : HTMLCanvasElement, x: number, y: number) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    }

    public draw(ctx : CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.health > 0 ? ctx.fillStyle = "green" : ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    public update() {
        if (this.health <= 0) return;
        
        if (this.x + this.radius > this.canvas.width) {
            this.movingSpeed = -this.speed;
        } else if (this.x - this.radius < 0) {
            this.movingSpeed = this.speed;
        }

        this.x += this.movingSpeed;
    }

    public getX() : number {
        return this.x;
    }

    public getY() : number {
        return this.y;
    }

    public getRadius() : number {
        return this.radius;
    }

    public getHealth() : number {
        return this.health;
    }

    public setHealth(health : number) {
        this.health = health;
    }

    public takeDamage(damage : number) {
        this.health -= damage;
    }
}