export default class Monster {
    constructor(canvas, x, y) {
        this.radius = 50;
        this.speed = 3;
        this.movingSpeed = 3;
        this.health = 150;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.health > 0 ? ctx.fillStyle = "green" : ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
    update() {
        if (this.health <= 0)
            return;
        if (this.x + this.radius > this.canvas.width) {
            this.movingSpeed = -this.speed;
        }
        else if (this.x - this.radius < 0) {
            this.movingSpeed = this.speed;
        }
        this.x += this.movingSpeed;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getRadius() {
        return this.radius;
    }
    getHealth() {
        return this.health;
    }
    setHealth(health) {
        this.health = health;
    }
    takeDamage(damage) {
        this.health -= damage;
    }
}
