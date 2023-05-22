// Constants
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// Game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 10 };
let direction = 'right';
let score = 0;
let gameLoop;

// Change snake direction based on arrow keys
function changeSnakeDirection(event) {
  const key = event.keyCode;
  const upArrow = 38;
  const downArrow = 40;
  const leftArrow = 37;
  const rightArrow = 39;

  switch (key) {
    case upArrow:
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case downArrow:
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
    case leftArrow:
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case rightArrow:
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
  }
}

// Game over logic for Snake game
function gameOverSnake() {
  document.removeEventListener('keydown', changeSnakeDirection);
  document.getElementById('score').textContent = score;
  document.getElementById('score-input').value = score;
  document.getElementById('game-over').style.display = 'block';
}

// Update Snake game state
function updateSnakeGame() {
  const head = { x: snake[0].x, y: snake[0].y };

  // Update snake position based on direction
  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }

  // Check collision with walls or self
  console.log('x is:', head.x);
  console.log('y is:', head.y);
  console.log('gridHeight is:', gridHeight);
  console.log('gridWidth is:', gridWidth);
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= gridWidth ||
    head.y >= gridHeight ||
    checkSnakeCollision(head)
  ) {
    clearInterval(gameLoop);
    gameOverSnake();
    return;
  }

  // Check collision with food
  if (head.x === food.x && head.y === food.y) {
    // Increase score
    score += 10;
    // Generate new food
    generateSnakeFood();
  } else {
    // Remove tail segment if no food was eaten
    snake.pop();
  }

  // Add new head segment
  snake.unshift(head);

  // Draw game objects
  drawSnakeGame();
}

// Game initialization
function initGame() {
  // Initialize the game based on gameName
  if (gameName === 'snake') {
    initSnakeGame();
    document.addEventListener('keydown', changeSnakeDirection);
    gameLoop = setInterval(updateSnakeGame, 150);
  } else if (gameName === 'pacman') {
    initPacmanGame();
  } else if (gameName === 'space_invaders') {
    initSpaceInvadersGame();
  } else {
    console.error('Invalid game name!');
    return;
  }

  clearInterval(gameLoop);
}

// Draw snake game objects on the canvas
function drawSnakeGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw snake
  snake.forEach((segment) => {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
  // Draw food
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Check collision with snake segments
function checkSnakeCollision(position) {
  return snake.some(
    (segment) => segment.x === position.x && segment.y === position.y
  );
}

// Generate new food at random position
function generateSnakeFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };

  // Check if new food overlaps with snake
  if (checkSnakeCollision(food)) {
    generateSnakeFood(); // Generate new food again
  }
}

// Initialize Snake game
function initSnakeGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 10 };
  direction = 'right';
  score = 0;
  clearInterval(gameLoop);
  gameLoop = setInterval(updateSnakeGame, 150);
  document.addEventListener('keydown', changeSnakeDirection);
}

// Initialize the game
initGame();
