import "./audio";

const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const resetBtn = document.getElementById("resetButton");
const toggleBtn = document.getElementById("toggleButton");
const toggleText = document.getElementById("toggleText");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const unitSize = 20;
const boardBackground = "rgb(125, 202, 182)";

const snakeColor = "green";
const headColor = "rgb(17, 67, 17)";

const foodBorder = "red";
let foodColor = "red";

let running = false;
let pause = false;

let xVelocity = unitSize;
let yVelocity = 0;

let foodX;
let foodY;

let score = 0;

let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

const DIRECTION_LEFT = "LEFT";
const DIRECTION_UP = "UP";
const DIRECTION_RIGHT = "RIGHT";
const DIRECTION_DOWN = "DOWN";

let currentDirection = DIRECTION_RIGHT;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
toggleBtn.addEventListener("click", startGame);

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function startGame(event) {
  event.currentTarget.blur();

  if (!running) {
    running = true;
    pause = false;
    scoreText.textContent = score;
    toggleText.textContent = "Pause";
    createFood();
    drawFood();
    nextStep();
  } else {
    pause = true;
    toggleText.textContent = "Start";
    displayPause();
  }
}

function nextStep() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextStep();
    }, 250);
  } else if (!running) {
    if (pause) {
      displayPause();
    } else {
      toggleBtn.disabled = true;
      resetBtn.disabled = false;
      displayGameOver();
    }
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) - min) / unitSize) * unitSize;
    return randNum;
  }

  let foodOnSnake = true;
  while (foodOnSnake) {
    foodOnSnake = false;
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);

    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === foodX && snake[i].y === foodY) {
        foodOnSnake = true;
        break;
      }
    }
  }

  foodColor = getRandomColor();
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.strokeStyle = foodBorder;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(
    foodX + unitSize / 2,
    foodY + unitSize / 2,
    unitSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.stroke();
}

function moveSnake() {
  switch (currentDirection) {
    case DIRECTION_RIGHT:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case DIRECTION_LEFT:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case DIRECTION_UP:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case DIRECTION_DOWN:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
    default:
      break;
  }

  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };
  snake.unshift(head);

  if (snake[0].x === foodX && snake[0].y === foodY) {
    handleEat();
    score += 1;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.lineWidth = 3;
  ctx.strokeStyle = getRandomColor();

  snake.forEach((snakePart, index) => {
    ctx.beginPath();
    ctx.arc(
      snakePart.x + unitSize / 2,
      snakePart.y + unitSize / 2,
      unitSize / 2,
      0,
      2 * Math.PI
    );

    if (index === 0) {
      ctx.fillStyle = headColor;
    } else {
      ctx.fillStyle = snakeColor;
    }

    ctx.fill();
    ctx.stroke();
  });
}

function changeDirection(e) {
  const keyPressed = e.keyCode;

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  switch (keyPressed) {
    case LEFT:
      if (currentDirection !== DIRECTION_RIGHT) {
        currentDirection = DIRECTION_LEFT;
      }
      break;
    case RIGHT:
      if (currentDirection !== DIRECTION_LEFT) {
        currentDirection = DIRECTION_RIGHT;
      }
      break;
    case UP:
      if (currentDirection !== DIRECTION_DOWN) {
        currentDirection = DIRECTION_UP;
      }
      break;
    case DOWN:
      if (currentDirection !== DIRECTION_UP) {
        currentDirection = DIRECTION_DOWN;
      }
      break;
    default:
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  handleCrash();
  ctx.font = "60px Playpen Sans";
  ctx.fillStyle = "#242424";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}

function displayPause() {
  ctx.font = "60px Playpen Sans";
  ctx.fillStyle = "#242424";
  ctx.textAlign = "center";
  ctx.fillText("PAUSE!", gameWidth / 2, gameHeight / 2);
  running = false;
}

function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  scoreText.textContent = score;
  toggleText.textContent = "Start";
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  clearBoard();
  toggleBtn.disabled = false;
  resetBtn.disabled = true;
  crashSound.pause();
  crashSound.currentTime = 0;
}

const crashSound = document.getElementById("crashSound");
const eatSound = document.getElementById("eatSound");

function handleCrash() {
  crashSound.play();
}

function handleEat() {
  if (eatSound.paused) {
    eatSound.currentTime = 0;
    eatSound.play();
  }
}
