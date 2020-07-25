// Variables declaration and initialization
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let message = 'ERROR-404';
message = message.split("");
message = message.map(String);
let lettersCount = message.length;
let isClickingDown = false;

// CANVAS OBJECTS CREATION

// Create coding zones object (properties)
const codingZone = {
  x: canvas.width / 3,
  y: canvas.height / 3
}

// Create ball object (properties and canvas element)
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  vx: 2,
  vy: -2,
  color: 'blue',
  drawRoundBall: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
  drawSquareBall: function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.radius * 1.5, this.radius * 1.5);
    ctx.closePath();
    ctx.fillStyle = '#333333';
    ctx.fill();
  },
  moveBall: function() {
    this.x += this.vx;
    this.y += this.vy;

    // Wall collisions (right/left)
    if (this.x + this.radius >= canvas.width || this.x - (this.radius / 2) <= 0) {
      this.vx = -this.vx;
    }

    // Wall collision (top/bottom)
    if (this.y + this.radius >= canvas.height || this.y <= 0) {
      this.vy = -this.vy;
    }

    // Paddle collisions (left, right, up)
    if (
      this.x - this.radius >= paddle.x &&
      this.x + this.radius <= paddle.x + paddle.w &&
      this.y + this.radius >= paddle.y &&
      this.y - this.radius <= paddle.y + paddle.h 
    ) {
      this.vy = -this.vy;
    }

    // Squares collisions
    squares.forEach(square => {
        if (square.visible) {
          if (
            this.x - this.radius >= square.x && // left square side check
            this.x + this.radius <= square.x + square.w && // right square side check
            this.y + this.radius >= square.y && // top square side check
            this.y - this.radius <= square.y + square.h // bottom square side check
          ) {
            this.vy = -this.vy;
            square.visible = false;

            score.increaseScore();
          }
        }
    });

    // Hit bottom wall - Lose
    if (this.y + this.radius > canvas.height) {
      showAllSquares();
      score.value = 0;
    }
  }
};

// Create paddle object (properties and canvas element)
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 50,
  w: 80,
  h: 30,
  speed: 8,
  vx: 0,
  drawPaddle: function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.closePath();
    ctx.fillStyle = '#1A2831';
    ctx.fill();
  },
  movePaddle: function() {
    this.x += this.vx;

    // Wall detection
    if (this.x + this.w > canvas.width) {
      this.x = canvas.width - this.w;
    }

    if (this.x < 0) {
      this.x = 0;
    }
  }
};

// Create square object (properties, array of squares and canvas element)
const square = {
  w: 30,
  h: 30,
  padding: 10,
  offsetX: 5,
  offsetY: 20,
  visible: true
};

const squares = [];
for (let i = 0; i < lettersCount; i++) {
  squares[i] = message[i];
  const x = i * (square.w + square.padding) + square.offsetX;
  const y = (square.h + square.padding) + square.offsetY;
  squares[i] = { x, y, ...square };
}

function drawSquares() {
  squares.forEach((square, i) => {
      ctx.strokeStyle = square.visible ? '#1A2831' : 'transparent';
      ctx.strokeRect(square.x, square.y, square.w, square.h);
      ctx.fillStyle = square.visible ? '#1A2831' : 'transparent';
      ctx.font = "16px Helvetica";
      ctx.fillText(message[i], square.x + 9, square.y + (square.y/3));
    });
}

// Create score object (properties and canvas element)
const score = {
  value: 0,
  drawScore: function() {
    ctx.fillStyle = '#1A2831';
    ctx.font = '20px Helvetica';
    ctx.fillText(`Score: ${this.value}`, canvas.width - 100, 30);
  },
  increaseScore: function() {
    this.value++;

    if (this.value % lettersCount === 0) {
      showAllSquares();
    }
  }
}

// FUNCTIONALITIES

// Make all squares reappear when game over
function showAllSquares() {
  squares.forEach(square => {
    square.visible = true;
    });
}

// Clear the canvas
function clear() {
  if(ball.y < (codingZone.y * 3) && ball.y > (codingZone.y * 2))
  {
    ctx.fillStyle = "#E9D8B6";
    ctx.fillRect(0, 0, canvas.width, canvas.height / 3);
    ctx.fillStyle = "#E9C46A";
    ctx.fillRect(0, (canvas.height - (2 * (canvas.height / 3))), canvas.width, canvas.height / 3);
    ctx.fillStyle = 'rgba(255, 170, 102, 0.1)';
    ctx.fillRect(0, (canvas.height - canvas.height / 3), canvas.width, canvas.height / 3);
  }
  else
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Draw everything
function draw() {

  // Change coding zone
  if(ball.y < codingZone.y)
  {
    ball.drawSquareBall();
  } else if(ball.y < (codingZone.y * 2) && ball.y > codingZone.y)
  {
    ball.color = '#F45661';
    ball.drawRoundBall();
  }else if(ball.y < (codingZone.y * 3) && ball.y > (codingZone.y * 2))
  {
    ball.color = '#E6E6E6';
    ball.drawRoundBall();
  }

  paddle.drawPaddle();
  score.drawScore();
  drawSquares();
}

function moveObjects()
{
  ball.moveBall();
  paddle.movePaddle();
}

// Update canvas for animation
function update() {
  clear();
  moveObjects();
  draw();

  requestAnimationFrame(update);
}

// Update canvas
update();

// CONTROLLERS

// Keyboard controllers
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.vx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.vx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.vx = 0;
  }
}

// Mouse controllers
function mouseDown(e) {
  isClickingDown = true;
}

function mouseMove(e) {
  if(isClickingDown) {
    paddle.x = (e.offsetX - paddle.w/2);
  }
}

function mouseUp(e) {
  if (isClickingDown) {
    isClickingDown = false;
  }
}

// Touch/Tactile controllers
function touchStart(e) {
  isClickingDown = true;
}

function touchMove(e) {
  if(isClickingDown) {
    paddle.x = (e.touches[0].clientX - paddle.w/2);
  }
}

function touchEnd(e) {
  if (isClickingDown) {
    isClickingDown = false;
  }
}

// Controllers event handlers
document.addEventListener('keydown', keyDown, {passive: true});
document.addEventListener('keyup', keyUp);
document.getElementById("canvas").addEventListener('mousedown', mouseDown, {passive: true});
document.getElementById("canvas").addEventListener('mousemove', mouseMove, {passive: true});
document.getElementById("canvas").addEventListener('mouseup', mouseUp, {passive: true});
document.getElementById("canvas").addEventListener('touchstart', touchStart, {passive: true});
document.getElementById("canvas").addEventListener('touchmove', touchMove, {passive: true});
document.getElementById("canvas").addEventListener('touchend', touchEnd, {passive: true});