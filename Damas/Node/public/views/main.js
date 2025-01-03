import Piece from "./piece.js";
const gameBoard = document.querySelector(".game-board");
const pieces = [];
let lastSelected = null;
// FUNÇÃO QUE CRIA AS PEÇAS E ADICIONA NA GRID
/* const generateGrid = () => {

    // CRIA AS PEÇAS PRETAS
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x += 1) {
            pieces.push(new Piece(((x+1) * 2) - (y % 2), y + 1, "normal", "black"));
        }
    }

    // CRIA AS PEÇAS BRANCAS
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x += 1) {
            pieces.push(new Piece(((x+1) * 2) - (((y % 2) + 1) % 2) , 8 - y, "normal", "white"));
        }
    }
    
    // ADICIONA AS PEÇAS CRIADAS À TELA
    pieces.forEach((p) => {
        gameBoard.appendChild(p.element);
        p.element.addEventListener("click", () => handleClick(p));
    });
    
};
 */
const generateGrid = () => {
    for (let y = 1; y <= 8; y++) {
        pieces[y] = [];
        for (let x = 1; x <= 4; x++) {
            if (y <= 3) {
                pieces[y].push(new Piece(x * 2 - ((y + 1) % 2), y, "normal", "black"));
            }
            else if (y >= 6) {
                pieces[y].push(new Piece(x * 2 - ((y + 1) % 2), y, "normal", "white"));
            }
        }
    }
    pieces.forEach((row) => {
        row.forEach((p) => {
            gameBoard.appendChild(p.element);
            p.element.addEventListener("click", () => handleClick(p.x, p.y));
        });
    });
};
// POSIÇÕES RELATIVAS AOS QUATRO CANTOS EM TORNO DA PEÇA
const positions = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 }
];
// RODA TODA VEZ QUE É CLICADO EM UMA PEÇA
const handleClick = (posX, posY) => {
    // REMOVE TODOS OS CIRCULOS QUE MOSTRAVAM ONDE A PEÇA PODE ANDAR
    document.querySelectorAll(".moveTo").forEach(el => el.remove());
    // VERIFICA SE NÃO ESTA CLICANDO NA MESMA PEÇA DUAS VEZES PARA APAGAR OS CIRCULOS DE MOVIMENTO
    if (posX === (lastSelected === null || lastSelected === void 0 ? void 0 : lastSelected.x) && posY === (lastSelected === null || lastSelected === void 0 ? void 0 : lastSelected.y)) {
        lastSelected = null;
        return;
    }
    lastSelected = { x: posX, y: posY };
    for (const pos in positions) {
        if (pieces[posX + positions[pos].x][posY + positions[pos].y].x != posX + positions[pos].x && pieces[posX + positions[pos].x][posY + positions[pos].y].x != posX + positions[pos].y) {
            console.log("A");
            createMoveAtPosition(pieces[posX][posY], posX + positions[pos].x, posY + positions[pos].y);
        }
    }
    /* const piecesLength = pieces.length;
    const positionsCopy = [...positions];
    for (let i = 0; i < piecesLength; i++) {
        if (pieces[i].x === p.x + positionsCopy[0].x && pieces[i].y === p.y + positionsCopy[0].y) {

        }
    } */
    /* // VERIFICA PARA QUAIS DIREÇÕES PODEM APARECER OS CIRCULOS
    for (const pos in positions) {
        
        let outsideBoard = false;
        let posX = p.x + positions[pos].x;
        let posY = p.y + positions[pos].y;

        // VERIFICA SE NÃO PASSOU DO TABULEIRO
        if (posX > 8 || posX < 1 || posY > 8 || posY < 1) outsideBoard = true;
        
        if (!outsideBoard) {
            let found = findPieceByPosition(posX, posY);

            if (found.bool && p.color != found.color) {
                let newPosX = posX + positions[pos].x;
                let newPosY = posY + positions[pos].y;

                if (!(newPosX > 8 || newPosX < 1 || newPosY > 8 || newPosY < 1)) {
                    found = findPieceByPosition(newPosX, newPosY);
                    if (!found.bool) {
                        createMoveAtPosition(p, newPosX, newPosY);
                    }
                };
            }

            else if (!found.bool) {
                createMoveAtPosition(p, posX, posY);
            }
        }
    } */
};
/* // VERIFICA SE EXISTE UMA PEÇA NA POSIÇÃO X E Y
const findPieceByPosition = (posX: number, posY: number) => {
    const piecesLength = pieces.length;
    for (let i = 0; i < piecesLength; i++) {
        // VERIFICA SE UMA PEÇA NÃO ESTÁ NAQUELA POSIÇÃO
        if (pieces[i].x === posX && pieces[i].y === posY) {
            return {bool: true, color: pieces[i].color};
        };
    };
    return {bool: false};
}
 */
// CRIA OS CIRCULOS DE MOVIMENTO
const createMoveAtPosition = (piece, posX, posY) => {
    const el = document.createElement("div");
    el.classList.add("moveTo", "x" + posX, "y" + posY);
    el.addEventListener("click", () => handleMoveClick(piece, posX, posY));
    gameBoard.appendChild(el);
};
// FUNÇÃO QUE AGE QUANDO O JOGADOR CLICA NO CIRCULO DE MOVIMENTO
const handleMoveClick = (piece, x, y) => {
    document.querySelectorAll(".moveTo").forEach(el => el.remove());
    piece.setPosition(x, y);
    lastSelected = null;
};
generateGrid();
console.log(pieces);
