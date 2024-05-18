// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the control buttons
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');

// Define the grid size and cell size
const rows = 50;
const cols = 50;
const cellSize = 10;

// Initialize the grids
let grid = createGrid(rows, cols);
let nextGrid = createGrid(rows, cols);

// Store the animation frame ID
let animationId;

// Create a grid filled with zeros
function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

// Draw the grid on the canvas
function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

// Update the grid based on the Game of Life rules
function updateGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1) {
                nextGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                nextGrid[row][col] = neighbors === 3 ? 1 : 0;
            }
        }
    }
    // Swap the grids
    [grid, nextGrid] = [nextGrid, grid];
}

// Count the number of alive neighbors for a cell
function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const row = (x + i + rows) % rows;
            const col = (y + j + cols) % cols;
            sum += grid[row][col];
        }
    }
    return sum;
}

// Randomize the initial grid
function randomizeGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row][col] = Math.random() > 0.8 ? 1 : 0;
        }
    }
}

// The main game loop
function gameLoop() {
    updateGrid();
    drawGrid(grid);
    animationId = requestAnimationFrame(gameLoop);
}

// Start the game loop if it's not already running
function startGame() {
    if (!animationId) {
        gameLoop();
    }
}

// Stop the game loop
function stopGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// Reset the game grid and stop the game
function resetGame() {
    stopGame();
    grid = createGrid(rows, cols);
    drawGrid(grid);
}

// Add event listeners for the control buttons
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', () => {
    resetGame();
    randomizeGrid();
    drawGrid(grid);
});

// Initialize the game with a random grid
randomizeGrid();
drawGrid(grid);
