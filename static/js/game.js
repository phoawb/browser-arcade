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

// Restart the game
function restartGame() {
  location.reload(); // Reload the page to restart the game
}

// Change snake direction based on arrow keys
function changeSnakeDirection(event) {
  console.log('changing direction...');
  const key = event.key;
  const upArrow = 'ArrowUp';
  const downArrow = 'ArrowDown';
  const leftArrow = 'ArrowLeft';
  const rightArrow = 'ArrowRight';

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
  document.getElementById('restart-button').style.display = 'block';
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

// -------------------------------------------------------- SPACE INVADERS GAME LOGIC ----------------------------------------------------

// Game variables
let invaders = [];
let bullets = [];
let player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 20,
  height: 20,
};
let lives = 3;

// Create invaders
function createInvaders() {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      invaders.push({
        x: col * 50 + 30,
        y: row * 30 + 30,
        width: 20,
        height: 20,
        destroyed: false,
      });
    }
  }
}

// Move invaders
function moveInvaders() {
  invaders.forEach((invader) => {
    invader.x += 2;
  });
}

/* function moveInvaders() {
  let reachedEdge = false;

  // Check if any invader has reached the edge of the screen
  invaders.forEach((invader) => {
    // Check if invader has reached the right edge
    if (invader.direction === 1 && invader.x + invader.width >= canvas.width) {
      reachedEdge = true;
    }

    // Check if invader has reached the left edge
    if (invader.direction === -1 && invader.x <= 0) {
      reachedEdge = true;
    }
  });

  // If invaders reached the edge, change direction and move down
  if (reachedEdge) {
    invaders.forEach((invader) => {
      invader.direction *= -1; // Change direction
      invader.y += invader.height; // Move down
    });
  }

  // Move invaders horizontally
  invaders.forEach((invader) => {
    invader.x += invader.direction * 2; // Update x-position based on direction
  });
} */

// Move bullets
function moveBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= 5;
  });
}

// Check collision between bullet and invader
function checkBulletInvaderCollision() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = invaders.length - 1; j >= 0; j--) {
      const invader = invaders[j];

      if (
        !invader.destroyed &&
        bullet.x >= invader.x - invader.width / 2 &&
        bullet.x <= invader.x + invader.width / 2 &&
        bullet.y >= invader.y - invader.height / 2 &&
        bullet.y <= invader.y + invader.height / 2
      ) {
        invaders.splice(j, 1);
        bullets.splice(i, 1);
        score += 10;
        break;
      }
    }
  }
}

// Check collision between player and invader
function checkPlayerInvaderCollision() {
  for (let i = invaders.length - 1; i >= 0; i--) {
    const invader = invaders[i];

    if (
      !invader.destroyed &&
      player.x >= invader.x - invader.width / 2 &&
      player.x <= invader.x + invader.width / 2 &&
      player.y >= invader.y - invader.height / 2 &&
      player.y <= invader.y + invader.height / 2
    ) {
      invaders.splice(i, 1);
      lives--;

      if (lives === 0) {
        gameOverSpaceInvaders();
      }
      break;
    }
  }
}

// Update Space Invaders game state
function updateSpaceInvadersGame() {
  moveInvaders();
  moveBullets();
  checkBulletInvaderCollision();
  checkPlayerInvaderCollision();
  drawSpaceInvadersGame();
  setTimeout(function () {
    requestAnimationFrame(updateSpaceInvadersGame);
  }, 1000 / 10); // Delay of 100 milliseconds (10 frames per second)
}

// Game over logic for Space Invaders game
function gameOverSpaceInvaders() {
  clearInterval(gameLoop);
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-button').style.display = 'block';
}

// Draw Space Invaders game objects on the canvas
function drawSpaceInvadersGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log('drawing space invaders game');
  // Draw player
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(
    player.x - player.width / 2,
    player.y - player.height / 2,
    player.width,
    player.height
  );
  // Draw invaders
  console.log('invaders length is', invaders.length);
  invaders.forEach((invader) => {
    if (!invader.destroyed) {
      console.log('Tryig to draw invader...');
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(
        invader.x - invader.width / 2,
        invader.y - invader.height / 2,
        invader.width,
        invader.height
      );
    }
  });
  // Draw bullets
  bullets.forEach((bullet) => {
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(bullet.x - 2, bullet.y - 10, 4, 10);
  });
  // Draw lives and score
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.fillText(`Lives: ${lives}`, 10, 30);
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function spaceInvadersControls(event) {
  const leftArrow = 'ArrowLeft';
  const rightArrow = 'ArrowRight';
  const spaceBar = ' ';

  switch (event.key) {
    case leftArrow:
      console.log('left arrow was pressed!');
      player.x -= 5;
      break;
    case rightArrow:
      player.x += 5;
      break;
    case spaceBar:
      bullets.push({ x: player.x, y: player.y });
      break;
  }
}

// Game initialization
function initSpaceInvadersGame() {
  console.log('do we go into the fucntion?');
  createInvaders();
  document.addEventListener('keydown', spaceInvadersControls);
  updateSpaceInvadersGame();
}

// Game initialization
function initGame() {
  // Initialize the game based on gameName
  console.log('game name is:', gameName);
  if (gameName === 'snake') {
    initSnakeGame();
    //gameLoop = setInterval(updateSnakeGame, 150);
  } else if (gameName === 'pacman') {
    initPacmanGame();
  } else if (gameName === 'space_invaders') {
    console.log('Do we properly get to the space invaders?');
    initSpaceInvadersGame();
    gameLoop = setInterval(updateSpaceInvadersGame, 160);
  } else {
    console.error('Invalid game name!');
    return;
  }

  clearInterval(gameLoop);
}

// Initialize the game
initGame();
