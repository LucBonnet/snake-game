const w = innerWidth;
const h = innerHeight;

let interval;

const snake = {
  color: "#00ffaa",
  scale: 15,
  x: 0,
  y: 0,
  positions: [],
  size: 2,
  direction: [1, 0],
  speed: 1000,
};

const apple = {
  color: "#ff0000",
  scale: snake.scale,
  position: [],
};

const boardW = Math.floor(w / snake.scale);
const boardH = Math.floor(h / snake.scale);

document.querySelector(
  "body"
).innerHTML = `<canvas id="canvas" width=${w} height=${h}></canvas>`;
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

function setup() {
  snake.x = Math.floor(boardW / 4) * snake.scale - snake.scale;
  snake.y = (boardH / 2) * snake.scale - snake.scale;

  generateApple();

  interval = setInterval(update, snake.speed);
}

function update() {
  resetCanvas();

  ctx.fillStyle = snake.color;
  ctx.fillRect(snake.x, snake.y, snake.scale, snake.scale);

  snake.positions.forEach((position) => {
    ctx.fillStyle = snake.color;
    ctx.fillRect(position[0], position[1], snake.scale, snake.scale);
  });

  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.position[0], apple.position[1], apple.scale, apple.scale);

  const appleX = apple.position[0];
  const appleY = apple.position[1];

  const distance = Math.sqrt(
    Math.pow(snake.x - appleX, 2) + Math.pow(snake.y - appleY, 2)
  );

  if (distance < snake.scale) {
    eat();
  }

  for (let i = 0; i < snake.positions.length - 1; i++) {
    snake.positions[i] = snake.positions[i + 1];
  }
  snake.positions[snake.size - 1] = [snake.x, snake.y];

  if (snake.x + snake.direction[0] * snake.scale > w) {
    snake.x = 0;
  } else if (snake.x + snake.direction[0] * snake.scale < 0) {
    snake.x = Math.floor(w / snake.scale) * snake.scale;
  } else {
    snake.x = snake.x + snake.direction[0] * snake.scale;
  }

  if (snake.y + snake.direction[1] * snake.scale > h) {
    snake.y = 0;
  } else if (snake.y + snake.direction[1] * snake.scale < 0) {
    snake.y = Math.floor(h / snake.scale) * snake.scale;
  } else {
    snake.y = snake.y + snake.direction[1] * snake.scale;
  }

  gameOver();
}

function resetCanvas() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, w, h);
}

function generateApple() {
  let x = snake.x;
  let y = snake.y;

  do {
    x = Math.floor(Math.random() * boardW) * apple.scale;
    y = Math.floor(Math.random() * boardH) * apple.scale;
  } while (JSON.stringify(snake.positions).includes(JSON.stringify([x, y])));

  apple.position = [x, y];
}

document.addEventListener("keydown", (evt) => {
  const event = events[evt.code];

  if (event) event();
});

const events = {
  ArrowUp: () => {
    if (snake.direction[0] != 0 && snake.direction[1] != 1)
      snake.direction = [0, -1];
  },

  ArrowDown: () => {
    if (snake.direction[0] != 0 && snake.direction[1] != -11)
      snake.direction = [0, 1];
  },

  ArrowLeft: () => {
    if (snake.direction[0] != 1 && snake.direction[1] != 0)
      snake.direction = [-1, 0];
  },

  ArrowRight: () => {
    if (snake.direction[0] != -1 && snake.direction[1] != 0)
      snake.direction = [1, 0];
  },
};

function gameOver() {
  if (
    JSON.stringify(snake.positions).includes(JSON.stringify([snake.x, snake.y]))
  ) {
    clearInterval(interval);
    alert("Game Over");
    snake.x = 0;
    snake.y = 0;
    snake.positions = [];
    snake.size = 2;
    snake.direction = [1, 0];
    setup();
  }
}

function eat() {
  generateApple();
  snake.size++;
}

setup();
