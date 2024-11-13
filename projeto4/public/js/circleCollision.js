const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const circle1 = { x: 50, y: 50, radius: 50, color: "red" };
const circle2 = { x: 200, y: 200, radius: 60, color: "black" };
const speed = 5;
const move = { x: 0, y: 0 };
function main() {
    canvas.width = 800;
    canvas.height = 600;
    function draw() {
        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = circle2.color;
        ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = circle1.color;
        ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
        ctx.fill();
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}
function update() {
    circle1.x += move.x;
    circle1.y += move.y;
    circle1.color = "red";
    if (Math.hypot(circle1.x - circle2.x, circle1.y - circle2.y) <= circle1.radius + circle2.radius) {
        circle1.color = "green";
    }
}
window.addEventListener("keydown", (e) => {
    if (e.code === "KeyD") {
        move.x = speed;
    }
    else if (e.code === "KeyA") {
        move.x = -speed;
    }
    else if (e.code === "KeyS") {
        move.y = speed;
    }
    else if (e.code === "KeyW") {
        move.y = -speed;
    }
});
addEventListener("keyup", (e) => {
    if (e.code === "KeyD" && move.x > 0) {
        move.x = 0;
    }
    else if (e.code === "KeyA" && move.x < 0) {
        move.x = 0;
    }
    else if (e.code === "KeyS" && move.y > 0) {
        move.y = 0;
    }
    else if (e.code === "KeyW" && move.y < 0) {
        move.y = 0;
    }
});
main();
export {};
