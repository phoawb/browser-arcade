// Constants
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const paddleWidth = 80;
const paddleHeight = 10;
const paddleSpeed = 8;
const ballRadius = 5;
const ballSpeed = 3;
const initialLives = 3;

// Game variables
let paddleX = canvas.width / 2 - paddleWidth / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - paddleHeight - ballRadius - 1;
let ballDX = ballSpeed;
let ballDY = -ballSpeed;
let score = 0;
let lives = initialLives;

// Keyboard state
const keys = {};
document.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

// Update game state
function update() {
  // Move paddle
  if (keys.ArrowLeft && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
  if (keys.ArrowRight && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  }

  // Move ball
  ballX += ballDX;
  ballY += ballDY;

  // Check ball collision with walls
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
    ballDX *= -1;
  }
  if (ballY - ballRadius < 0) {
    ballDY *= -1;
  }

  // Check ball collision with paddle
  if (
    ballY + ballRadius > canvas.height - paddleHeight &&
    ballX > paddleX &&
    ballX < paddleX + paddleWidth
  ) {
    ballDY = -ballSpeed;
    score += 10;
  }

  // Check ball collision with bottom
  if (ballY + ballRadius > canvas.height) {
    lives--;
    resetBall();
    if (lives === 0) {
      endGame();
    }
  }
}

// Reset ball position
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height - paddleHeight - ballRadius - 1;
  ballDX = ballSpeed;
  ballDY = -ballSpeed;
}

// Draw game state
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddle
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#FF0000';
  ctx.fill();
  ctx.closePath();

  // Draw score
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 20);

  // Draw lives
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.fillText('Lives: ' + lives, canvas.width - 80, 20);
}

// End the game
function endGame() {
  // Display game over message
  const gameOverElement = document.getElementById('game-over');
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;
  gameOverElement.style.display = 'block';

  // Hide game canvas and info
  canvas.style.display = 'none';
  document.getElementById('game-info').style.display = 'none';

  // Update score input value
  const scoreInput = document.getElementById('score-input');
  scoreInput.value = score;
}

// Restart the game
function restartGame() {
  // Reset game variables
  paddleX = canvas.width / 2 - paddleWidth / 2;
  resetBall();
  score = 0;
  lives = initialLives;

  // Hide game over message
  const gameOverElement = document.getElementById('game-over');
  gameOverElement.style.display = 'none';

  // Show game canvas and info
  canvas.style.display = 'block';
  document.getElementById('game-info').style.display = 'block';
}

// Game loop
function gameLoop() {
  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
  // Hide game over message initially
  document.getElementById('game-over').style.display = 'none';

  // Show game canvas and info
  canvas.style.display = 'block';
  document.getElementById('game-info').style.display = 'block';

  // Start game loop
  gameLoop();
}

// Start the game when the window has loaded
window.addEventListener('load', startGame);
