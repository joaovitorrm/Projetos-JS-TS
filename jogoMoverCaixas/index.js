"use strict";
// GRABBING ELEMENTS FROM DOM
const player = document.querySelector(".player");
const map = document.querySelector(".map");
// GAME OPTIONS
const position = { x: 0, y: 0 };
const moving = { x: 0, y: 0 };
const speed = 2;
const gameSpeed = 5;
let movingId = undefined;
let walls;
let collidible = [];
let canPush = [];
let collisions = [];
const level = [
    "wwwwwwwwwwwwwwwwwwww",
    "w       w   w  w   w",
    "w   wm mw   w mw   w",
    "w   w m w   w  m   w",
    "w   w m w  mw mwwmmw",
    "wmmmw   w   wm w m w",
    "w   w m  m mw mw   w",
    "w   w   w  m   w    ",
    "w p w   w   w  w   w",
    "wwwwwwwwwwwwwwwwwwww"
];
const createLevel = () => {
    level.forEach((row, y) => {
        row.split("").forEach((col, x) => {
            if (col === "w") {
                const wall = document.createElement("div");
                wall.classList.add("wall");
                wall.style.left = `${x * 50}px`;
                wall.style.top = `${y * 50}px`;
                map.appendChild(wall);
                collidible.push(wall);
            }
            else if (col === "p") {
                player.style.left = `${x * 50}px`;
                player.style.top = `${y * 50}px`;
                position.x = x * 50;
                position.y = y * 50;
            }
            else if (col === "m") {
                const box = document.createElement("div");
                box.classList.add("box");
                box.style.left = `${x * 50}px`;
                box.style.top = `${y * 50}px`;
                map.appendChild(box);
                canPush.push(box);
            }
        });
    });
    walls = document.querySelectorAll(".wall");
};
const createCollisions = () => {
    const wallsCopy = [...collidible];
    let actual = { x: wallsCopy[0].offsetLeft, y: wallsCopy[0].offsetTop, width: wallsCopy[0].offsetWidth, height: wallsCopy[0].offsetHeight };
    // SETTING COLLISIONS BY SEARCHING HORIZONTAL
    for (let i = 1; i < wallsCopy.length; i++) {
        if (wallsCopy[i].offsetLeft === actual.x + actual.width) {
            actual.width += wallsCopy[i].offsetWidth;
            wallsCopy.splice(--i, 1);
        }
        else {
            if (actual.width > wallsCopy[i].offsetWidth) {
                collisions.push(Object.assign({}, actual));
                wallsCopy.splice(--i, 1);
            }
            ;
            actual.width = wallsCopy[i].offsetWidth;
            actual.x = wallsCopy[i].offsetLeft;
            actual.y = wallsCopy[i].offsetTop;
        }
    }
    if (actual.width > wallsCopy[0].offsetWidth) {
        collisions.push(Object.assign({}, actual));
        wallsCopy.pop();
    }
    ;
    // SETTING COLLISIONS BY CHECKING VERTICAL
    for (let i = 0, actualIndex = 0; i < wallsCopy.length; i++) {
        actual.x = wallsCopy[i].offsetLeft;
        actual.y = wallsCopy[i].offsetTop;
        actual.width = wallsCopy[i].offsetWidth;
        actual.height = wallsCopy[i].offsetHeight;
        for (let j = i + 1; j < wallsCopy.length; j++) {
            if (wallsCopy[j].offsetTop === actual.y + actual.height && wallsCopy[j].offsetLeft === actual.x) {
                actual.height += wallsCopy[j].offsetHeight;
                wallsCopy.splice(actualIndex, 1);
                actualIndex = --j;
            }
            else if (wallsCopy[j].offsetTop >= actual.y + actual.height && wallsCopy[j].offsetLeft > actual.x) {
                break;
            }
        }
        if (actual.height > wallsCopy[i].offsetHeight) {
            collisions.push(Object.assign({}, actual));
            wallsCopy.splice(actualIndex, 1);
            actualIndex = i--;
        }
        else {
            actualIndex++;
        }
    }
    // ADD COLLISION TO THE LAST ONES
    while (wallsCopy.length > 0) {
        collisions.push({ x: wallsCopy[0].offsetLeft,
            y: wallsCopy[0].offsetTop,
            width: wallsCopy[0].offsetWidth,
            height: wallsCopy[0].offsetHeight });
        wallsCopy.shift();
    }
};
const showCollisions = () => {
    console.log(collisions.length);
    collisions.forEach((col) => {
        const div = document.createElement("div");
        div.classList.add("collision");
        div.style.left = `${col.x}px`;
        div.style.top = `${col.y}px`;
        div.style.width = `${col.width}px`;
        div.style.height = `${col.height}px`;
        map.appendChild(div);
    });
};
// MAIN FUNCTION
const main = () => {
    createLevel();
    createCollisions();
    // showCollisions();
    setEvents();
};
const move = () => {
    // HORIZONTAL MOVE
    position.x += moving.x;
    let wallCol = checkCollision();
    if (wallCol != false) {
        moving.x > 0 ? position.x = wallCol.x - player.offsetWidth : position.x = wallCol.x + wallCol.width;
    }
    ;
    let collidedObj = checkObjCollision();
    if (collidedObj != false) {
        position.x -= moving.x / 2;
        collidedObj.style.left = `${collidedObj.offsetLeft + moving.x}px`;
        if (checkBoxCollision(collidedObj)) {
            collidedObj.style.left = `${collidedObj.offsetLeft - moving.x}px`;
            moving.x > 0 ? position.x = collidedObj.offsetLeft - player.offsetWidth : position.x = collidedObj.offsetLeft + collidedObj.offsetWidth;
        }
    }
    player.style.left = `${position.x}px`;
    // VERTICAL MOVE
    position.y += moving.y;
    wallCol = checkCollision();
    if (wallCol != false) {
        moving.y > 0 ? position.y = wallCol.y - player.offsetHeight : position.y = wallCol.y + wallCol.height;
    }
    collidedObj = checkObjCollision();
    if (collidedObj != false) {
        position.y -= moving.y / 2;
        collidedObj.style.top = `${collidedObj.offsetTop + moving.y}px`;
        if (checkBoxCollision(collidedObj)) {
            collidedObj.style.top = `${collidedObj.offsetTop - moving.y}px`;
            moving.y > 0 ? position.y = collidedObj.offsetTop - player.offsetHeight : position.y = collidedObj.offsetTop + collidedObj.offsetHeight;
        }
    }
    player.style.top = `${position.y}px`;
};
const checkCollision = () => {
    // WALLS COLLISION
    for (const col of collisions) {
        if (position.x + player.offsetWidth > col.x && position.x < col.x + col.width &&
            position.y + player.offsetHeight > col.y && position.y < col.y + col.height) {
            return col;
        }
    }
    return false;
};
const checkBoxCollision = (box) => {
    // WALLS COLLISION
    for (const col of collisions) {
        if (box.offsetLeft + box.offsetWidth > col.x && box.offsetLeft < col.x + col.width &&
            box.offsetTop + box.offsetHeight > col.y && box.offsetTop < col.y + col.height) {
            return true;
        }
    }
    for (const col of canPush) {
        if (box != col) {
            if (box.offsetLeft + box.offsetWidth > col.offsetLeft && box.offsetLeft < col.offsetLeft + col.offsetWidth &&
                box.offsetTop + box.offsetHeight > col.offsetTop && box.offsetTop < col.offsetTop + col.offsetHeight) {
                return true;
            }
        }
    }
    return false;
};
const checkObjCollision = () => {
    for (const col of canPush) {
        if (position.x + player.offsetWidth > col.offsetLeft && position.x < col.offsetLeft + col.offsetWidth &&
            position.y + player.offsetHeight > col.offsetTop && position.y < col.offsetTop + col.offsetHeight) {
            return col;
        }
    }
    return false;
};
// EVENTS LISTENERS
const setEvents = () => {
    // KEYSDOWN
    document.addEventListener("keydown", (e) => {
        if (movingId === undefined) {
            if (["KeyD", "KeyA", "KeyS", "KeyW"].includes(e.code))
                movingId = setInterval(move, gameSpeed);
        }
        switch (e.code) {
            case "KeyD":
                moving.x = speed;
                break;
            case "KeyS":
                moving.y = speed;
                break;
            case "KeyA":
                moving.x = -speed;
                break;
            case "KeyW":
                moving.y = -speed;
                break;
        }
    });
    // KEYSUP
    document.addEventListener("keyup", (e) => {
        switch (e.code) {
            case "KeyD":
                if (moving.x > 0)
                    moving.x = 0;
                break;
            case "KeyS":
                if (moving.y > 0)
                    moving.y = 0;
                break;
            case "KeyA":
                if (moving.x < 0)
                    moving.x = 0;
                break;
            case "KeyW":
                if (moving.y < 0)
                    moving.y = 0;
                break;
        }
        if (moving.x === 0 && moving.y === 0) {
            clearInterval(movingId);
            movingId = undefined;
        }
    });
};
main();
