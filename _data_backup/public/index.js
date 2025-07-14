"use strict";

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;
canvas.style.background = "black";


let canvas_focus = false;
canvas.addEventListener("click", () => canvas_focus = true);
document.addEventListener("click", (e) => {
  if (e.target !== canvas) canvas_focus = false;
});

let window_width = canvas.width;
let window_height = canvas.height;


let pad_width = 10;
let pad_height = 80;
let pad_player1X = window_width - 100;
let pad_player1Y = window_height / 2 - pad_height / 2;
let pad_player2X = 100;
let pad_player2Y = window_height / 2 - pad_height / 2;

let ballX = window_width / 2;
let ballY = window_height / 2;
let ballRadius = 10;
let ballSpeedX = 4;
let ballSpeedY = 3;


let keysPressed = {};
document.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});


document.addEventListener('keydown', (e) => {
  const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '];
  if (scrollKeys.includes(e.key)) {
    e.preventDefault();
  }
});


function drawMiddlePath() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  for (let y = 0; y < window_height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(window_width / 2, y);
    ctx.lineTo(window_width / 2, y + 10);
    ctx.stroke();
  }
}


function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}


function updateGame() {
  ctx.clearRect(0, 0, window_width, window_height);

  if (keysPressed["ArrowUp"] && pad_player1Y > 0)
    pad_player1Y -= 5;
  if (keysPressed["ArrowDown"] && pad_player1Y + pad_height < window_height)
    pad_player1Y += 5;
  if (keysPressed["w"] && pad_player2Y > 0)
    pad_player2Y -= 5;
  if (keysPressed["s"] && pad_player2Y + pad_height < window_height)
    pad_player2Y += 5;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > window_height)
    ballSpeedY *= -1;
  if (ballX - ballRadius < 0 || ballX + ballRadius > window_width)
    ballSpeedX *= -1;

  drawMiddlePath();
  drawCircle(ballX, ballY, ballRadius);
  ctx.fillStyle = "white";
  ctx.fillRect(pad_player1X, pad_player1Y, pad_width, pad_height);
  ctx.fillRect(pad_player2X, pad_player2Y, pad_width, pad_height);

  requestAnimationFrame(updateGame);
}

//updateGame(); // Start animation
