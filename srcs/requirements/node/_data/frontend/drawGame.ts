import { game, rounds, ctx, keysPressed } from "./index.js"
import { showWinnerScreen } from "./tournament.js";

function drawMiddlePathRemote1v1(): void {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	for (let y = 0; y < game.canvas.height; y += 20) {
		ctx.beginPath();
		ctx.moveTo(game.canvas.width / 2, y);
		ctx.lineTo(game.canvas.width / 2, y + 10);
		ctx.stroke();
	}
}

function drawCircleRemote1v1(x: number, y: number, radius: number): void {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function calculatePaddleCoordsRemote1v1(): void {
	if (game.remoteMode && !game.multiplayerMode) {
		if (keysPressed["space"]) {
			fetch(`/pressSpaceRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["ArrowUp"]) {
			fetch(`/pressArrowUpRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["ArrowDown"]) {
			fetch(`/pressArrowDownRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["w"]) {
			fetch(`/pressWRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["s"]) {
			fetch(`/pressSRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
	}
}

export function drawGame() {
	if (game.players[0].playerscore === rounds) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
		showWinnerScreen(game, game.players[0].name);
		game.remoteMode = false;
	}
	if (game.players[1].playerscore === rounds) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
		showWinnerScreen(game, game.players[1].name);
		game.remoteMode = false;
	}
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	const playerColors = ["#00ccff", "#ffcc00"];
	ctx.font = "20px Arial";
	ctx.fillStyle = playerColors[0];
	ctx.fillText(`${game.players[0].name}: ${game.players[0].playerscore}`, 10, 25);
	ctx.fillStyle = playerColors[1];
	ctx.fillText(`${game.players[1].name}: ${game.players[1].playerscore}`, 10, 50);
	ctx.fillStyle = "white";
	ctx.fillText(
		"ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0),
		10,
		75
	);
	calculatePaddleCoordsRemote1v1();
	drawMiddlePathRemote1v1();
	drawCircleRemote1v1(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	const paddles = [game.player1Paddle, game.player2Paddle];
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
