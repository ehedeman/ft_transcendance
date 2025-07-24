const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 900;
canvas.height = 600;
canvas.style.background = "black";


let canvas_focus: boolean = false;
canvas.addEventListener("click", () => canvas_focus = true);
document.addEventListener("click", (e: MouseEvent) => {
  if (e.target !== canvas) canvas_focus = false;
});


const window_width: number = canvas.width;
const window_height: number = canvas.height;


const pad_width: number = 10;
const pad_height: number = 80;

let pad_player1X: number = window_width - 100;
let pad_player1Y: number = window_height / 2 - pad_height / 2;

let pad_player2X: number = 100;
let pad_player2Y: number = window_height / 2 - pad_height / 2;


let ballX: number = window_width / 2;
let ballY: number = window_height / 2;
const ballRadius: number = 10;
let ballSpeedX: number = 4;
let ballSpeedY: number = 3;


const keysPressed: { [key: string]: boolean } = {};
document.addEventListener("keydown", (e: KeyboardEvent) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e: KeyboardEvent) => {
  keysPressed[e.key] = false;
});


document.addEventListener("keydown", (e: KeyboardEvent) => {
  const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '];
  if (scrollKeys.includes(e.key)) {
    e.preventDefault();
  }
});


function drawMiddlePath(): void {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  for (let y = 0; y < window_height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(window_width / 2, y);
    ctx.lineTo(window_width / 2, y + 10);
    ctx.stroke();
  }
}


function drawCircle(x: number, y: number, radius: number): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}


function updateGame(): void {
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


updateGame();
