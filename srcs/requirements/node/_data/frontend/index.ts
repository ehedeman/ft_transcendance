import { Player, canvasInfo, BallInfo, playerPaddle, GameInfo } from "./frontendStructures.js";

let game = new GameInfo();

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
const keysPressed: { [key: string]: boolean } = {};
document.addEventListener("keydown", (e: KeyboardEvent) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e: KeyboardEvent) => {
  keysPressed[e.key] = false;
});
document.addEventListener("keydown", (e: KeyboardEvent) => {
	const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
	if (scrollKeys.indexOf(e.key) !== -1) {
		e.preventDefault();
	}
});
document.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key === " " && !canvas_focus) {
		fetch("/pressspace");
	}
});

let gamefinished = false;

document.getElementById("registerButton")?.addEventListener("click", () => { // TODO: don't forget that add enough players to play a game
	const player_name = prompt("Enter your name:");
	if (!player_name) {
		alert("Name cannot be empty!");
		return;
	}
	game.players.push({
		name: player_name ? player_name : "Anonymous",
		gamesWon: 0,
		gamesLost: 0,
		playerscore: 0
	});
});

function drawMiddlePath(): void {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	for (let y = 0; y < game.canvas.height; y += 20) {
		ctx.beginPath();
		ctx.moveTo(game.canvas.width / 2, y);
		ctx.lineTo(game.canvas.width / 2, y + 10);
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

function searchPlayer(name: string): number {
	for (let i = 0; i < game.players.length; i++) {
		if (game.players[i].name === name) {
			return i;
		}
	}
	return -1; // Player not found
}

function calculatePaddleCoords():void
{
	if (keysPressed["ArrowUp"]) {
    	fetch("/pressArrowUp");
	}
	if (keysPressed["ArrowDown"]) {
		fetch("/pressArrowDown");
	}
	if (keysPressed["w"]) {
		fetch("/pressW");
	}
	if (keysPressed["s"]) {
		fetch("/pressS");
	}
}

function getGameStatus(): void {
	if (!gamefinished) {
		fetch("/getstatus")
		.then(response => response.json())
		.then(data => {
			game.ball.ballX = data.ballX;
			game.ball.ballY = data.ballY;
			game.player1Paddle.y = data.player1_y;
			game.player2Paddle.y = data.player2_y;
			game.players[0].playerscore = data.player1_score;
			game.players[1].playerscore = data.player2_score;
			game.ball.ballSpeedX = data.ballSpeedX;// Update ball speed
			if (data.gamefinished) {
				alert("Game Over! Final Score: " + game.players[0].name + " " + game.players[0].playerscore + " - " + game.players[1].name + " " + game.players[1].playerscore);
				fetch("/resetgame")
				.then(response => response.json())
				.then(data => {
					game.ball.ballX = data.ballX;
					game.ball.ballY = data.ballY;
					game.player1Paddle.y = data.player1_y;
					game.player2Paddle.y = data.player2_y;
					game.players[0].playerscore = data.player1_score;
					game.players[1].playerscore = data.player2_score;
				});
			}
		});
	}
}

function singlePlayerGame(): void {
	if (game.players[0].playerscore === 5) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
	}
	if (game.players[1].playerscore === 5) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
	}
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.players[0].name + ": " + game.players[0].playerscore, 10, 25);
	ctx.fillText(game.players[1].name + ": " + game.players[1].playerscore, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoords();
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);
	getGameStatus();
}

function updateGame(): void {
	if (game.players.length >= 2) {
		singlePlayerGame();
	}
	requestAnimationFrame(updateGame);
}
updateGame();
