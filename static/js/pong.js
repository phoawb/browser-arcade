const canvas = document.getElementById('game-canvas');
if (!canvas) {
  throw console.error('canvas not found');
}
const ctx = canvas.getContext('2d');

function getBallColor() {
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
let ballColor = '#0cdcca';
let haveScored = false;

// Restart the game
function restartGame() {
  location.reload(); // Reload the page to restart the game
}

function gameOver() {
  clearInterval(pongInterval);
  const buttonContainer = document.getElementById('button-container');
  document.removeEventListener('keydown', keyDownHandler);
  document.removeEventListener('keyup', keyUpHandler);
  document.getElementById('score').textContent = score;
  document.getElementById('score-input').value = score;
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('restart-button').style.display = 'block';
  if (buttonContainer) {
    buttonContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function increaseAcceleration(dx, dy) {
  if (dx < 0) {
    dx -= 1;
  } else {
    dx += 1;
  }
  if (dy < 0) {
    dy -= 1;
  } else {
    dy += 1;
  }
  return { dx, dy };
}

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let score = 0;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight' || e.key == 'd') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft' || e.key == 'a') {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '22px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score: ' + score, 8, 22);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();

  if (score != 0 && score % 50 == 0 && haveScored) {
    newAcceleration = increaseAcceleration(dx, dy);
    dx = newAcceleration.dx;
    dy = newAcceleration.dy;
    haveScored = false;
  }

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      score += 10;
      haveScored = true;
      ballColor = getBallColor();
    } else {
      gameOver();
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

let pongInterval = 0;
function init() {
  pongInterval = setInterval(draw, 10);
}

init();
