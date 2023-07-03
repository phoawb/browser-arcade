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

function getFoodColor() {
  let colorPalette = [
    '#ff71ce',
    '#05ffa1',
    '#b967ff',
    '#fffb96',
    '#01cdfe',
    '#FF0000',
    '#0cdcca',
  ];
  let colorIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[colorIndex];
}

let foodColor = getFoodColor();
let snakeColor = '#0cdcca';

// Restart the game
function restartGame() {
  location.reload(); // Reload the page to restart the game
}

function drawScore() {
  ctx.font = '20px Nostromo';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Score: ' + score, 8, 22);
}

// Change snake direction based on arrow keys
function changeSnakeDirection(event) {
  console.log('changing direction...');
  const key = event.key;

  if (key == 'ArrowUp' || key == 'w') {
    if (direction !== 'down') {
      direction = 'up';
    }
  } else if (key == 'ArrowDown' || key == 's') {
    if (direction !== 'up') {
      direction = 'down';
    }
  } else if (key == 'ArrowLeft' || key == 'a') {
    if (direction !== 'right') {
      direction = 'left';
    }
  } else if (key == 'ArrowRight' || key == 'd') {
    if (direction !== 'left') {
      direction = 'right';
    }
  }
}

// Game over logic for Snake game
function gameOverSnake() {
  const buttonContainer = document.getElementById('button-container');
  document.removeEventListener('keydown', changeSnakeDirection);
  document.getElementById('score').textContent = score;
  document.getElementById('score-input').value = score;
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-button').style.display = 'block';
  if (buttonContainer) {
    buttonContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
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
    snakeColor = foodColor;
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

  // Draw score
  drawScore();

  // Delay before requesting the next animation frame
  setTimeout(function () {
    requestAnimationFrame(updateSnakeGame);
  }, 1000 / 10); // Delay of 100 milliseconds (10 frames per second)
}

// Draw snake game objects on the canvas
function drawSnakeGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw snake
  snake.forEach((segment) => {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
  // Draw food
  foodColor = getFoodColor();
  ctx.fillStyle = foodColor;
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
  console.log('initializing the snake game:');
  document.addEventListener('keydown', changeSnakeDirection);
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 10 };
  direction = 'right';
  score = 0;
  //clearInterval(gameLoop);
  //document.addEventListener('keydown', changeSnakeDirection);
  updateSnakeGame();
  //gameLoop = setInterval(updateSnakeGame, 150);
}

initSnakeGame();
