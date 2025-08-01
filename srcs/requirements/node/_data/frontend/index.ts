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
let ballSpeedX: number;
let ballSpeedY: number;

let player1_name = players[0]?.name || "Player 1"; // Default to "Player 1" if not set
let player2_name = players[1]?.name || "Player 2"; // Default to "Player 2" if not set
let player1_score = 0;
let player2_score = 0;
let ballPaused = true;

let gamefinished = false;

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

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === " " && !canvas_focus) {
    fetch("/pressspace");
  }
});

function searchPlayer(name: string): number {
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === name) {
      return i;
    }
  }
  return -1; // Player not found
}

function updateGame(): void {
  console.log("updateGame running"); 
  if (player1_score === 5) {
    const playerIndex = searchPlayer(player1_name);
    if (playerIndex >= 0) {
      players[playerIndex].gamesWon++;
    }
    const playerIndex2 = searchPlayer(player2_name);
    if (playerIndex2 >= 0) {
      players[playerIndex2].gamesLost++;
    }
  }
  player1_name = players[0]?.name || "Player 1";
  player2_name = players[1]?.name || "Player 2";
  ctx.clearRect(0, 0, window_width, window_height);
  ctx.font = "20px Arial"; ctx.fillStyle = "white";
  ctx.fillText(player1_name + ": " + player1_score, 10, 25);
  ctx.fillText(player2_name + ": " + player2_score, 10, 50);
  ctx.fillText("ballSpeedX: " + (ballSpeedX ? Math.abs(ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
  if (keysPressed["ArrowUp"] && pad_player1Y > 0) {
    fetch("/pressArrowUp");
  }
  if (keysPressed["ArrowDown"] && pad_player1Y + pad_height < window_height) {
    fetch("/pressArrowDown");
  }
  if (keysPressed["w"] && pad_player2Y > 0) {
    fetch("/pressW");
  }
  if (keysPressed["s"] && pad_player2Y + pad_height < window_height) {
    fetch("/pressS");
  }
  drawMiddlePath();
  drawCircle(ballX, ballY, ballRadius);//this part needs to be updated
  ctx.fillStyle = "white";
  ctx.fillRect(pad_player1X, pad_player1Y, pad_width, pad_height);
  ctx.fillRect(pad_player2X, pad_player2Y, pad_width, pad_height);
  if (!gamefinished) {
    fetch("/getstatus")
      .then(response => response.json())
      .then(data => {
        ballX = data.ballX;
        ballY = data.ballY;
        pad_player1Y = data.player1_y;
        pad_player2Y = data.player2_y;
        player1_score = data.player1_score;
        player2_score = data.player2_score;
        ballSpeedX = data.ballSpeedX;// Update ball speed
        if (data.gamefinished) {
          alert("Game Over! Final Score: " + player1_name + " " + player1_score + " - " + player2_name + " " + player2_score);
          fetch("/resetgame")
          .then(response => response.json())
          .then(data => {
            ballX = data.ballX;
            ballY = data.ballY;
            pad_player1Y = data.player1_y;
            pad_player2Y = data.player2_y;
            player1_score = data.player1_score;
            player2_score = data.player2_score;
            });
        }
    });
  }
  requestAnimationFrame(updateGame);
}
updateGame();
