import Turret from "./turret.js";
import Monster from "./monster.js";
class Game {
    constructor() {
        this.turrets = [];
        this.monsters = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 600;
        const turret1 = new Turret(this.canvas, 50, 50, 120, 120, "default");
        const turret2 = new Turret(this.canvas, 500, 500, 120, 120, "default");
        const turret3 = new Turret(this.canvas, 600, 100, 120, 120, "default");
        const monster1 = new Monster(this.canvas, 100, 500);
        const monster2 = new Monster(this.canvas, 500, 200);
        const monster3 = new Monster(this.canvas, 50, 300);
        const monster4 = new Monster(this.canvas, 155, 240);
        this.turrets.push(...[turret1, turret2, turret3]);
        this.monsters.push(...[monster1, monster2, monster3, monster4]);
    }
    init() {
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.addEventListener("mousemove", (e) => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.turrets.forEach(t => {
            t.draw(this.ctx);
        });
        this.monsters.forEach(m => {
            m.draw(this.ctx);
        });
    }
    update() {
        this.monsters.forEach((m, i) => {
            m.update();
            for (const t of this.turrets) {
                if (i === t.getTargetId() || t.getTargetId() === null) {
                    if (m.getHealth() > 0)
                        t.setSphereTarget(i, m.getX(), m.getY(), m.getRadius());
                }
            }
        });
        for (const t of this.turrets) {
            t.update();
            if (t.getHits() > 0) {
                const MonsterHit = t.getTargetId();
                this.monsters[MonsterHit].takeDamage(t.getHits() * t.getDamage());
                if (this.monsters[MonsterHit].getHealth() <= 0) {
                    for (const t2 of this.turrets) {
                        if (t2.getTargetId() === MonsterHit)
                            t2.clearTarget();
                    }
                }
            }
        }
    }
}
function main() {
    const game = new Game();
    game.init();
    function run() {
        game.update();
        game.draw();
        requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
}
main();
//        /* ctx.beginPath();
//        ctx.fillStyle = circle2.color;
//        ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
//        ctx.fill();
//        ctx.closePath(); */
//
//        /* ctx.beginPath();
//        ctx.fillStyle = circle1.color;
//        ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
//        ctx.fill();
//        ctx.closePath(); */
//
//        for (const ball of balls) {
//            updateBall(ball);
//            ctx.beginPath();
//            ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
//            ctx.fillStyle = "black";
//            ctx.fill();
//            ctx.closePath();
//        }
//        
//        window.requestAnimationFrame(draw);
//const circle1 = {x: 50, y: 50, radius: 50, color: "red"};
//const circle2 = {x: 200, y: 200, radius: 60, color: "black"};
//const tank = {x: 300, y: 300, size: 120, angle: 50};
//const speed : number = 5;
//const move : {x: number, y: number} = {x: 0, y: 0};
//const balls : {x: number, y: number, angle: number, radius: number}[] = [];
//
//const tank_spritesheet = new Image();
//tank_spritesheet.src = "./images/tank.png";
//
//function updateBall(ball : {x: number, y: number, angle: number, radius: number}) {
//    
//
//    /* if (checkBallCollision(ball, circle1)) {
//        balls.splice(balls.indexOf(ball), 1);
//    } */
//}
//
//
//
//function update() {
//   /*  circle1.x += move.x;
//    circle1.y += move.y;
//
//    circle1.color = "red";
//
//    if (checkBallCollision(circle1, circle2)) {
//        circle1.color = "green";
//    }
//}
//
//
//addEventListener("keydown", (e : KeyboardEvent) => {    
//    /* if (e.code === "KeyD") {
//        move.x = speed;
//    }
//    else if (e.code === "KeyA") {
//        move.x = -speed;
//    }
//    else if (e.code === "KeyS") {
//        move.y = speed;
//    }
//    else if (e.code === "KeyW") {
//        move.y = -speed;
//    } */
//})
//
//addEventListener("keyup", (e) => {
//    /* if (e.code === "KeyD" && move.x > 0) {
//        move.x = 0;
//    }
//    else if (e.code === "KeyA" && move.x < 0) {
//        move.x = 0;
//    }
//    else if (e.code === "KeyS" && move.y > 0) {
//        move.y = 0;
//    }
//    else if (e.code === "KeyW" && move.y < 0) {
//        move.y = 0;
//    } */
//    if (e.code === "Space") {
//        balls.push({x: tank.x + tank.size / 2, y: tank.y + tank.size / 2, angle: tank.angle, radius: 12});
//    }
//})
//
//main();
