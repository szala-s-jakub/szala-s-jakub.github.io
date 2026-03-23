let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = 2;
let difficulty = "easy";
let gameActive = true;

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");

function startGame(mode) {
    gameMode = mode;
    document.getElementById("game").classList.remove("hidden");

    if (mode === 1) {
        document.getElementById("difficulty").classList.remove("hidden");
    } else {
        document.getElementById("difficulty").classList.add("hidden");
    }

    createBoard();
}

function setDifficulty(level) {
    difficulty = level;
}

function createBoard() {
    boardElement.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Ruch: X";

    board.forEach((_, i) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleMove(i));
        boardElement.appendChild(cell);
    });
}

function handleMove(index) {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    render();

    if (checkWin()) {
        statusText.textContent = currentPlayer + " wygrywa!";
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "Remis!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = "Ruch: " + currentPlayer;

    if (gameMode === 1 && currentPlayer === "O") {
        setTimeout(aiMove, 300);
    }
}

function aiMove() {
    let move;

    if (difficulty === "easy") {
        let free = board.map((v,i) => v === "" ? i : null).filter(v => v !== null);
        move = free[Math.floor(Math.random() * free.length)];
    } else {
        move = bestMove();
    }

    handleMove(move);
}

function bestMove() {
    for (let pattern of winPatterns) {
        let values = pattern.map(i => board[i]);
        if (values.filter(v => v === "O").length === 2 && values.includes("")) {
            return pattern[values.indexOf("")];
        }
    }

    for (let pattern of winPatterns) {
        let values = pattern.map(i => board[i]);
        if (values.filter(v => v === "X").length === 2 && values.includes("")) {
            return pattern[values.indexOf("")];
        }
    }

    let free = board.map((v,i) => v === "" ? i : null).filter(v => v !== null);
    return free[Math.floor(Math.random() * free.length)];
}

function render() {
    document.querySelectorAll(".cell").forEach((cell, i) => {
        cell.textContent = board[i];
    });
}

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(i => board[i] === currentPlayer);
    });
}

function resetGame() {
    createBoard();
}