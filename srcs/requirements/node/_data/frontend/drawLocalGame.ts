import { game, rounds, ctx, keysPressed } from "./index.js"
import { showWinnerScreen } from "./tournament.js";

function drawMiddlePathLocalGame(): void {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	for (let y = 0; y < game.canvas.height; y += 20) {
		ctx.beginPath();
		ctx.moveTo(game.canvas.width / 2, y);
		ctx.lineTo(game.canvas.width / 2, y + 10);
		ctx.stroke();
	}
}

function drawCircleLocalGame(x: number, y: number, radius: number): void {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function calculatePaddleCoordsLocalGame(): void {
	if (game.localMode && !game.remoteMode && !game.multiplayerMode && !game.tournamentLoopActive) {
		if (keysPressed["space"]) {
			fetch(`/pressSpace`);
		}
		if (keysPressed["ArrowUp"]) {
			fetch(`/pressArrowUp`);
		}
		if (keysPressed["ArrowDown"]) {
			fetch(`/pressArrowDown`);
		}
		if (keysPressed["w"]) {
			fetch(`/pressW`);
		}
		if (keysPressed["s"]) {
			fetch(`/pressS`);
		}
	}
}

export function drawLocalGame() {
	if (game.players[0].playerscore === rounds) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
		showWinnerScreen(game, game.players[0].name);
		game.localMode = false;
	}
	if (game.players[1].playerscore === rounds) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
		showWinnerScreen(game, game.players[1].name);
		game.localMode = false;
	}
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.players[0].name + ": " + game.players[0].playerscore, 10, 25);
	ctx.fillText(game.players[1].name + ": " + game.players[1].playerscore, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoordsLocalGame();
	drawMiddlePathLocalGame();
	drawCircleLocalGame(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);
}