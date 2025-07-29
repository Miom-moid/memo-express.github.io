// إعدادات اللعبة
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");

// حجم كل جزء من الثعبان
const box = 20;

// الثعبان
let snake = [
  { x: 9 * box, y: 10 * box }
];

// الاتجاه
let direction = null;

// الطعام
let food = {
  x: Math.floor(Math.random() * 19 + 1) * box,
  y: Math.floor(Math.random() * 19 + 1) * box
};

// الدرجة
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.textContent = highScore;

// التحكم بالأسهم
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.keyCode;

  if (key === 37 && direction !== "RIGHT") direction = "LEFT";  // ←
  if (key === 38 && direction !== "DOWN")  direction = "UP";    // ↑
  if (key === 39 && direction !== "LEFT")  direction = "RIGHT"; // →
  if (key === 40 && direction !== "UP")    direction = "DOWN";  // ↓
}

// رسم الثعبان
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    // لون الرأس أغمق
    ctx.fillStyle = i === 0 ? "#2c3e50" : "#3498db";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    // الحدود البيضاء
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
}

// رسم الطعام
function drawFood() {
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(food.x, food.y, box, box);
}

// التحديثات
function update() {
  // إذا لم يبدأ الحركة، لا تتحرك
  if (direction === null) return;

  // تحريك الرأس
  let head = { x: snake[0].x, y: snake[0].y };

  switch (direction) {
    case "LEFT":  head.x -= box; break;
    case "UP":    head.y -= box; break;
    case "RIGHT": head.x += box; break;
    case "DOWN":  head.y += box; break;
  }

  // التحقق من الاصطدام بالجدران
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height
  ) {
    gameOver();
    return;
  }

  // التحقق من الاصطدام بالذات
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  // إذا أكل الطعام
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;

    // تحديث أعلى درجة
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
      localStorage.setItem("snakeHighScore", highScore);
    }

    // لا نزيل الذيل
    food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box
    };
  } else {
    // إزالة الذيل
    snake.pop();
  }

  // إضافة الرأس الجديد
  snake.unshift(head);

  // رسم كل شيء
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

// نهاية اللعبة
function gameOver() {
  clearInterval(game);
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("انتهت اللعبة!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText(`الدرجة: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// تشغيل اللعبة
let game = setInterval(update, 150);

// إعادة التشغيل
restartBtn.addEventListener("click", () => {
  direction = null;
  snake = [{ x: 9 * box, y: 10 * box }];
  score = 0;
  scoreElement.textContent = score;
  food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
  };
  clearInterval(game);
  game = setInterval(update, 150);
});
