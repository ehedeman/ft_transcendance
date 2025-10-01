import { game, rounds, ctx, keysPressed } from "./index.js"
import { showWinnerScreen } from "./tournament.js";

function judgeGame() {
	if (game.players[0].playerscore === rounds) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
		game.players[2].gamesWon++;
		game.players[3].gamesLost++;
		showWinnerScreen(game, game.players[0].name);
		showWinnerScreen(game, game.players[2].name);
		game.multiplayerGameStart = false;
		game.multiplayerMode = false;
	}
	if (game.players[1].playerscore === rounds) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
		game.players[2].gamesWon++;
		game.players[3].gamesLost++;
		showWinnerScreen(game, game.players[1].name);
		showWinnerScreen(game, game.players[3].name);
		game.multiplayerGameStart = false;
		game.multiplayerMode = false;
	}
}


function drawMiddlePathMultiplayer(): void {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	for (let y = 0; y < game.canvas.height; y += 20) {
		ctx.beginPath();
		ctx.moveTo(game.canvas.width / 2, y);
		ctx.lineTo(game.canvas.width / 2, y + 10);
		ctx.stroke();
	}
}

function drawCircleMultiplayer(x: number, y: number, radius: number): void {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function calculatePaddleCoordsMultiplayer(): void {
	if (game.multiplayerMode) {
		if (keysPressed["space"]) {
			fetch(`/pressSpaceMultiplayer?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["ArrowUp"]) {
			fetch(`/pressArrowUpMultiplayer?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["ArrowDown"]) {
			fetch(`/pressArrowDownMultiplayer?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["w"]) {
			fetch(`/pressWMultiplayer?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["s"]) {
			fetch(`/pressSMultiplayer?sender=${game.currentlyLoggedIn.name}`);
		}
	}
}

export function drawMultiplayerGame(): void {
	judgeGame();
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	const playerColors = ["#00ccff", "#ffcc00", "#66ff66", "#ff6666"];
	ctx.font = "20px Arial";
	for (let i = 0; i < 4; i++) {
		ctx.fillStyle = playerColors[i];
		ctx.fillText(
			`${game.players[i].name}: ${game.players[i].playerscore}`,
			10,
			25 + i * 25
		);
	}
	ctx.fillStyle = "white";
	ctx.fillText(
		"ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0),
		10,
		125
	);
	calculatePaddleCoordsMultiplayer();
	drawMiddlePathMultiplayer();
	drawCircleMultiplayer(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	const paddles = [
		game.player1Paddle,
		game.player2Paddle,
		game.player3Paddle,
		game.player4Paddle
	];
	for (let i = 0; i < paddles.length; i++) {
		ctx.fillStyle = playerColors[i];
		ctx.fillRect(
			paddles[i].x,
			paddles[i].y,
			paddles[i].width,
			paddles[i].height
		);
	}
}
