const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let message = 'ERROR-404-PAGE-NOT-FOUND';
message = message.split("");
message = message.map(String);
console.log(message);

const lettersCount = message.length;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

// Create letter props
const letterInfo = {
  w: 25,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// Create letters
const letters = [];
for (let i = 0; i < lettersCount; i++) {
  letters[i] = message[i];
  const x = i * (letterInfo.w + letterInfo.padding) + letterInfo.offsetX;
  const y = (letterInfo.h + letterInfo.padding) + letterInfo.offsetY;
  letters[i] = { x, y, ...letterInfo };
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw letters on canvas
function drawLetters() {
  letters.forEach((letter, i) => {
      ctx.font = `${letterInfo.w}px serif`;
      ctx.fillText(message[i], letter.x, letter.y);
      ctx.fillStyle = letter.visible ? '#0095dd' : 'transparent';
      ctx.fill();
    });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Letter collision
  letters.forEach(letter => {
      if (letter.visible) {
        if (
          ball.x - ball.size > letter.x && // left letter side check
          ball.x + ball.size < letter.x + letter.w && // right letter side check
          ball.y + ball.size > letter.y && // top letter side check
          ball.y - ball.size < letter.y + letter.h // bottom letter side check
        ) {
          ball.dy *= -1;
          letter.visible = false;

          increaseScore();
        }
      }
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllLetters();
    score = 0;
  }
}

// Increase score
function increaseScore() {
  score++;

  if (score % lettersCount === 0) {
    showAllLetters();
  }
}

// Make all letters appear
function showAllLetters() {
  letters.forEach(letter => (letter.visible = true
    ));
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawLetters();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
