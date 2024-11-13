import Piece from "./piece.js";

const gameBoard : HTMLDivElement = document.querySelector(".game-board")!;
const pieces : Piece[] = [];
let lastSelected : Piece | null = null;

// FUNÇÃO QUE CRIA AS PEÇAS E ADICIONA NA GRID
const generateGrid = () => {

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

// POSIÇÕES RELATIVAS AOS QUATRO CANTOS EM TORNO DA PEÇA
const positions : {x: number, y: number}[] = [
    {x: -1, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 1},
    {x: 1, y: 1}
]

// RODA TODA VEZ QUE É CLICADO EM UMA PEÇA
const handleClick = (p: Piece) => {

    // REMOVE TODOS OS CIRCULOS QUE MOSTRAVAM ONDE A PEÇA PODE ANDAR
    document.querySelectorAll(".moveTo").forEach(el => el.remove());

    // VERIFICA SE NÃO ESTA CLICANDO NA MESMA PEÇA DUAS VEZES PARA APAGAR OS CIRCULOS DE MOVIMENTO
    if (p === lastSelected) {
        lastSelected = null;
        return;
    }
    lastSelected = p;

    /* const piecesLength = pieces.length;
    const positionsCopy = [...positions];
    for (let i = 0; i < piecesLength; i++) {
        if (pieces[i].x === p.x + positionsCopy[0].x && pieces[i].y === p.y + positionsCopy[0].y) {

        }
    } */

    // VERIFICA PARA QUAIS DIREÇÕES PODEM APARECER OS CIRCULOS
    for (const pos in positions) {
        
        let outSideBoard = false;

        // VERIFICA SE NÃO PASSOU DA GRID NO EIXO X
        if (p.x + positions[pos].x > 8 || p.x + positions[pos].x < 1) outSideBoard = true;

        // VERIFICA SE NÃO PASSOU DA GRID NO EIXO Y
        else if (p.y + positions[pos].y > 8 || p.y + positions[pos].y < 1) outSideBoard = true;
        
        if (!outSideBoard) {
            const piecesLength = pieces.length;
            let found = false;
            for (let i = 0; i < piecesLength; i++) {
                // VERIFICA SE UMA PEÇA NÃO ESTÁ NAQUELA POSIÇÃO
                if (pieces[i].x === p.x + positions[pos].x && pieces[i].y === p.y + positions[pos].y) {
                    found = true;
                    break;
                };

            }

            if (!found) {
                // CRIA OS CIRCULOS DE MOVIMENTO
                const el = document.createElement("div");            
                el.classList.add("moveTo", "x" + (p.x + positions[pos].x), "y" + (p.y + positions[pos].y));            
                el.addEventListener("click", () => handleMoveClick(p, p.x + positions[pos].x, p.y + positions[pos].y));
                gameBoard.appendChild(el);
            }
        }        
    }
}

const handleMoveClick = (piece: Piece, x: number, y: number) => {
    document.querySelectorAll(".moveTo").forEach(el => el.remove());
    piece.setPosition(x, y);
}

generateGrid();
console.log(pieces);
