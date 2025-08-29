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
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.players[0].name + ": " + game.players[0].playerscore, 10, 25);
	ctx.fillText(game.players[1].name + ": " + game.players[1].playerscore, 10, 50);
	ctx.fillText(game.players[2].name + ": " + game.players[2].playerscore, 10, 75);
	ctx.fillText(game.players[3].name + ": " + game.players[3].playerscore, 10, 100);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 125); // Display ball speed
	calculatePaddleCoordsMultiplayer();
	drawMiddlePathMultiplayer();
	drawCircleMultiplayer(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);
	ctx.fillRect(game.player3Paddle.x, game.player3Paddle.y, game.player3Paddle.width, game.player3Paddle.height);
	ctx.fillRect(game.player4Paddle.x, game.player4Paddle.y, game.player4Paddle.width, game.player4Paddle.height);
}