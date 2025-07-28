const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

type Player = {
  name: string;
  gamesWon: number;
  gamesLost: number;
};

let players: Player[] = [];

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
const pad_height: number = 200;

let pad_player1X: number = window_width - 100;
let pad_player1Y: number = window_height / 2 - pad_height / 2;

let pad_player2X: number = 100;
let pad_player2Y: number = window_height / 2 - pad_height / 2;


let ballX: number = window_width / 2;
let ballY: number = window_height / 2;
const ballRadius: number = 10;
let ballSpeedX: number = 4;
let ballSpeedY: number = 3;

let player1_name = players[0]?.name || "Player 1"; // Default to "Player 1" if not set
let player2_name = players[1]?.name || "Player 2"; // Default to "Player 2" if not set
let player1_score = 0;
let player2_score = 0;
let ballPaused = true;

const keysPressed: { [key: string]: boolean } = {};
document.addEventListener("keydown", (e: KeyboardEvent) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e: KeyboardEvent) => {
  keysPressed[e.key] = false;
});

document.getElementById("registerButton")?.addEventListener("click", () => {
  const player_name = prompt("Enter your name:");
  if (!player_name) {
    alert("Name cannot be empty!");
    return;
  }
  players.push({
    name: player_name,
    gamesWon: 0,
    gamesLost: 0
  });
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
  const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
  if (scrollKeys.indexOf(e.key)) {
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


function touchingPaddle1(): boolean {
  return (
    ballX - ballRadius < pad_player1X + pad_width &&
    ballX + ballRadius > pad_player1X &&
    ballY + ballRadius > pad_player1Y &&
    ballY - ballRadius < pad_player1Y + pad_height
  );
}

function touchingPaddle2(): boolean {
  return (
    ballX - ballRadius < pad_player2X + pad_width &&
    ballX + ballRadius > pad_player2X &&
    ballY + ballRadius > pad_player2Y &&
    ballY - ballRadius < pad_player2Y + pad_height
  );
}


function resetBall(): void {
  ballX = window_width / 2;
  ballY = window_height / 2;
  ballPaused = true;
}


document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === " " && !canvas_focus && ballPaused) {
    ballSpeedX *= -1; // send ball toward the last scorer
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1); // slight randomness
    ballPaused = false; // unpause the ball
  }
});


function calculateBallCoords(): void {
  if (ballPaused) return; // Skip updates if the ball is paused
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off top and bottom
  if (ballY - ballRadius < 0 || ballY + ballRadius > window_height) {
    ballSpeedY *= -1;
  }

  // Check paddle collisions
  if (touchingPaddle1() && ballSpeedX > 0) {
    ballSpeedX *= -1;
  } else if (touchingPaddle2() && ballSpeedX < 0) {
    ballSpeedX *= -1;
  }

  // Check if ball passed player1 (left side)
  if (ballX - ballRadius < 0) {
    player1_score++;
    resetBall();
  }

  // Check if ball passed player2 (right side)
  if (ballX + ballRadius > window_width) {
    player2_score++;

    resetBall();
  }
}

function searchPlayer(name: string): number {
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === name) {
      return i;
    }
  }
  return -1; // Player not found
}

function resetGame(): void {
  player1_score = 0;
  player2_score = 0;
  // reset the name of the players
}

function updateGame(): void {
  if (player1_score === 5) {
    alert(player1_name + " wins!");
    const playerIndex = searchPlayer(player1_name);
    if (playerIndex >= 0) {
      players[playerIndex].gamesWon++;
    }
    const playerIndex2 = searchPlayer(player2_name);
    if (playerIndex2 >= 0) {
      players[playerIndex2].gamesLost++;
    }
    resetGame();
  }
  player1_name = players[0]?.name || "Player 1";
  player2_name = players[1]?.name || "Player 2";
  ctx.clearRect(0, 0, window_width, window_height);
  ctx.font = "20px Arial"; ctx.fillStyle = "white";
  ctx.fillText(player1_name + ": " + player1_score, 10, 25);
  ctx.fillText(player2_name + ": " + player2_score, 10, 50);
  if (keysPressed["ArrowUp"] && pad_player1Y > 0) pad_player1Y -= 5;
  if (keysPressed["ArrowDown"] && pad_player1Y + pad_height < window_height)
    pad_player1Y += 5;
  if (keysPressed["w"] && pad_player2Y > 0)
    pad_player2Y -= 5;
  if (keysPressed["s"] && pad_player2Y + pad_height < window_height)
    pad_player2Y += 5;
  calculateBallCoords();
  drawMiddlePath();
  drawCircle(ballX, ballY, ballRadius);
  ctx.fillStyle = "white";
  ctx.fillRect(pad_player1X, pad_player1Y, pad_width, pad_height);
  ctx.fillRect(pad_player2X, pad_player2Y, pad_width, pad_height);
  requestAnimationFrame(updateGame);
}

updateGame();
