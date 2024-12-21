const container = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const continueButton = document.getElementById('continueButton');
const newGameButton = document.getElementById('newGameButton');
const gameOverScreen = document.getElementById('gameOver');
const winScreen = document.getElementById('winScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const winScoreDisplay = document.getElementById('winScore');
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
let board = [];
let score = 0;
let hasWon = false;

function initGame() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    hasWon = false;
    gameOverScreen.style.display = 'none';
    winScreen.style.display = 'none';
    addTile();
    addTile();
    draw();
    container.style.display = 'grid';
}

function addTile() {
    const emptyTiles = [];
    board.forEach((row, r) => row.forEach((value, c) => {
        if (value === 0) emptyTiles.push({ r, c });
    }));
    if (emptyTiles.length === 0) return;
    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function draw() {
    container.innerHTML = '';
    board.forEach(row => {
        row.forEach(value => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.innerText = value || '';
            tile.style.backgroundColor = getTileColor(value);
            container.appendChild(tile);
        });
    });
    scoreDisplay.innerText = score;
    container.appendChild(gameOverScreen);
    container.appendChild(winScreen);
}

function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#ccc0b3';
    }
}

function isGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return false;
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

function checkWin() {
    if (!hasWon && board.some(row => row.some(cell => cell === 2048))) {
        hasWon = true;
        winScreen.style.display = 'flex';
        winScoreDisplay.innerText = score;
    }
}

function checkGameOver() {
    if (isGameOver()) {
        gameOverScreen.style.display = 'flex';
        finalScoreDisplay.innerText = score;
    }
}

function move(dir) {
    if (gameOverScreen.style.display === 'flex') return;
    
    const oldBoard = JSON.stringify(board);

    if (dir === 'up' || dir === 'down') {
        for (let c = 0; c < 4; c++) {
            let column = board.map(row => row[c]);
            if (dir === 'down') column.reverse();
            
            column = compress(column);
            column = mergeTiles(column);
            column = compress(column);
            
            if (dir === 'down') column.reverse();
            
            for (let r = 0; r < 4; r++) {
                board[r][c] = column[r];
            }
        }
    } else {
        for (let r = 0; r < 4; r++) {
            let row = board[r].slice();
            if (dir === 'right') row.reverse();
            
            row = compress(row);
            row = mergeTiles(row);
            row = compress(row);
            
            if (dir === 'right') row.reverse();
            
            board[r] = row;
        }
    }

    if (oldBoard !== JSON.stringify(board)) {
        addTile();
        draw();
        checkWin();
        checkGameOver();
    }
}

function compress(line) {
    const newLine = line.filter(cell => cell !== 0);
    while (newLine.length < 4) {
        newLine.push(0);
    }
    return newLine;
}

function mergeTiles(line) {
    for (let i = 0; i < 3; i++) {
        if (line[i] !== 0 && line[i] === line[i + 1]) {
            line[i] *= 2;
            score += line[i];
            line[i + 1] = 0;
        }
    }
    return line;
}

startButton.addEventListener('click', initGame);
restartButton.addEventListener('click', initGame);
continueButton.addEventListener('click', () => winScreen.style.display = 'none');
newGameButton.addEventListener('click', initGame);

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

upButton.addEventListener('click', () => move('up'));
downButton.addEventListener('click', () => move('down'));
leftButton.addEventListener('click', () => move('left'));
rightButton.addEventListener('click', () => move('right'));
