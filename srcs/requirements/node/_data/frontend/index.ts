 let canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
 let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

/*---------------------------type declaration-------------------------------------*/
type Player = {
  name: string;
  gamesWon: number;
  gamesLost: number;
};

type GameInfo = {
  player1PaddleX: number;
  player1PaddleY: number;
  player2PaddleX: number;
  player2PaddleY: number;
  pad_width: number;
  pad_height: number;
  window_width: number;
  window_height: number;
  player1StartCoordsX: number;
  player1StartCoordsY: number;
  player2StartCoordsX: number;
  player2StartCoordsY: number;
}

type BallInfo = {
  ballX: number;
  ballY: number;
  ballRadius: number;
  ballSpeedX: number;
  ballSpeedY: number;
  ballPaused: boolean;
}

interface TournamentInfo {
  playersTournament: Player[];
  tournamentActive: boolean;
  winner: Player;
}

/*---------------------------variable declaration---------------------------------*/

let playersGeneral: Player[] = [];

canvas.width = 900;
canvas.height = 600;
canvas.style.background = "black";

 let game: GameInfo = ({
  pad_width: 10,
  pad_height: 200,

  player1StartCoordsX: canvas.width - 100,
  player1StartCoordsY: canvas.height / 2 - 200 / 2,
  player2StartCoordsX: 100,
  player2StartCoordsY: canvas.height / 2 - 200 / 2,

  player1PaddleX: canvas.width - 100,
  player1PaddleY: canvas.height / 2 - 200 / 2,
  player2PaddleX: 100,
  player2PaddleY: canvas.height / 2 - 200 / 2,
  window_height: canvas.height,
  window_width: canvas.width,
});

let ball: BallInfo = {
  ballX: game.window_width / 2,
  ballY: game.window_height / 2,
  ballRadius: 10,
  ballSpeedX: 4,
  ballSpeedY: 3,
  ballPaused: true,
}

let tournament: TournamentInfo = {
  playersTournament: [],
  tournamentActive: false,
  winner: playersGeneral[0], //can be null
}

let canvas_focus: boolean = false;

let player1_name = playersGeneral[0]?.name || "Player 1"; // Default to "Player 1" if not set
let player2_name = playersGeneral[1]?.name || "Player 2"; // Default to "Player 2" if not set
let player1_score = 0;
let player2_score = 0;

/*---------------------------events declaration-----------------------------------*/

canvas.addEventListener("click", () => canvas_focus = true);
document.addEventListener("click", (e: MouseEvent) => {
  if (e.target !== canvas) canvas_focus = false;
});

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
  playersGeneral.push({
    name: player_name,
    gamesWon: 0,
    gamesLost: 0
  });
});

document.getElementById("tournamentButton")?.addEventListener("click", () => 
{
	const registerButton = document.getElementById("registerButton");
	const tournamentButton = document.getElementById("tournamentButton");
		// Hide register button
	if (registerButton)
	  registerButton.style.display = "none" ;
	if (tournamentButton)
	  tournamentButton.style.display = "none" ;
	// Create and insert a reset/exit button
	const resetButton = document.createElement("button");
	resetButton.id = "resetButton";
	resetButton.textContent = "Reset Tournament";
	resetButton.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4";
	resetButton.style.position = "absolute";
	resetButton.style.zIndex = "2";
	resetButton.style.left = "50%";
	resetButton.style.top = "10%";
	resetButton.style.transform = "translateX(-50%)";

	document.body.appendChild(resetButton);
	// Example reset behavior
	resetButton.addEventListener("click", () =>
	{
	  // Reload the page or restore buttons
	  location.reload();
	});
  tournamentStart();
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
  const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
  if (scrollKeys.indexOf(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === " " && !canvas_focus && ball.ballPaused) {
    ball.ballSpeedX *= -1; // send ball toward the last scorer
    ball.ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1); // slight randomness
    ball.ballPaused = false; // unpause the ball
  }
});

/*---------------------------function declaration---------------------------------*/

function tournamentStart(): void {
    const player_name = prompt("Enter your name:");
  if (!player_name) {
    alert("Name cannot be empty!");
    return;
  }
  playersGeneral.push({
    name: player_name,
    gamesWon: 0,
    gamesLost: 0
  });
}

function drawMiddlePath(): void {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  for (let y = 0; y < game.window_height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(game.window_width / 2, y);
    ctx.lineTo(game.window_width / 2, y + 10);
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
    ball.ballX - ball.ballRadius < game.player1PaddleX + game.pad_width &&
    ball.ballX + ball.ballRadius > game.player1PaddleX &&
    ball.ballY + ball.ballRadius > game.player1PaddleY &&
    ball.ballY - ball.ballRadius < game.player1PaddleY + game.pad_height
  );
}

function touchingPaddle2(): boolean {
  return (
    ball.ballX - ball.ballRadius < game.player2PaddleX + game.pad_width &&
    ball.ballX + ball.ballRadius > game.player2PaddleX &&
    ball.ballY + ball.ballRadius > game.player2PaddleY &&
    ball.ballY - ball.ballRadius < game.player2PaddleY + game.pad_height
  );
}

function resetPlayer(): void {
  game.player1PaddleX = game.player1StartCoordsX;
  game.player1PaddleY = game.player1StartCoordsY;

  game.player2PaddleX = game.player2StartCoordsX;
  game.player2PaddleY = game.player2StartCoordsY;
}

function resetBall(): void {
  ball.ballX = game.window_width / 2;
  ball.ballY = game.window_height / 2;
  ball.ballPaused = true;
}


function calculateBallCoords(): void {
  if (ball.ballPaused) return; // Skip updates if the ball is paused
  ball.ballX += ball.ballSpeedX;
  ball.ballY += ball.ballSpeedY;

  // Bounce off top and bottom
  if (ball.ballY - ball.ballRadius < 0 || ball.ballY + ball.ballRadius > game.window_height) {
    ball.ballSpeedY *= -1;
  }

  // Check paddle collisions
  if (touchingPaddle1() && ball.ballSpeedX > 0) {
    ball.ballSpeedX *= -1;
  } else if (touchingPaddle2() && ball.ballSpeedX < 0) {
    ball.ballSpeedX *= -1;
  }

  // Check if ball passed player1 (left side)
  if (ball.ballX - ball.ballRadius < 0) {
    player1_score++;
    resetBall();
    resetPlayer();
  }

  // Check if ball passed player2 (right side)
  if (ball.ballX + ball.ballRadius > game.window_width) {
    player2_score++;
    resetBall();
    resetPlayer();
  }
}

function calculatePaddleCoords():void
{
  if (ball.ballPaused)
    return ;
  if (keysPressed["ArrowUp"] && game.player1PaddleY > 0) game.player1PaddleY -= 5;
  if (keysPressed["ArrowDown"] && game.player1PaddleY + game.pad_height < game.window_height)
    game.player1PaddleY += 5;
  if (keysPressed["w"] && game.player2PaddleY > 0)
    game.player2PaddleY -= 5;
  if (keysPressed["s"] && game.player2PaddleY + game.pad_height < game.window_height)
    game.player2PaddleY += 5;
}

function searchPlayer(name: string): number {
  for (let i = 0; i < playersGeneral.length; i++) {
    if (playersGeneral[i].name === name) {
      return i;
    }
  }
  return -1; // Player not found
}

function resetGame(): void {
  player1_score = 0;
  player2_score = 0;
  // reset the name of the playersGeneral
}

function updateGame(): void {
  if (player1_score === 5) {
    alert(player1_name + " wins!");
    const playerIndex = searchPlayer(player1_name);
    if (playerIndex >= 0) {
      playersGeneral[playerIndex].gamesWon++;
    }
    const playerIndex2 = searchPlayer(player2_name);
    if (playerIndex2 >= 0) {
      playersGeneral[playerIndex2].gamesLost++;
    }
    resetGame();
  }
  player1_name = playersGeneral[0]?.name || "Player 1";
  player2_name = playersGeneral[1]?.name || "Player 2";
  ctx.clearRect(0, 0, game.window_width, game.window_height);
  ctx.font = "20px Arial"; ctx.fillStyle = "white";
  ctx.fillText(player1_name + ": " + player1_score, 10, 25);
  ctx.fillText(player2_name + ": " + player2_score, 10, 50);
  calculatePaddleCoords();
  calculateBallCoords();
  drawMiddlePath();
  drawCircle(ball.ballX, ball.ballY, ball.ballRadius);
  ctx.fillStyle = "white";
  ctx.fillRect(game.player1PaddleX, game.player1PaddleY, game.pad_width, game.pad_height);
  ctx.fillRect(game.player2PaddleX, game.player2PaddleY, game.pad_width, game.pad_height);
  requestAnimationFrame(updateGame);
}

/*------------------------------actual code start---------------------------------*/

updateGame();
