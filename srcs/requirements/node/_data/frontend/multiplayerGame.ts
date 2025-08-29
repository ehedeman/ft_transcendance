import { game, rounds, ctx, keysPressed } from "./index.js";
import { Player } from "./frontendStructures.js";
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

function getGameStatusMultiplayer(): void {
	if (!game.gamefinished) {
		var length = game.t.matches.length;
		fetch("/getstatusMultiplayer")
			.then(response => response.json())
			.then(data => {
				game.ball.ballX = data.ballX;
				game.ball.ballY = data.ballY;
				game.player1Paddle.y = data.player1_y;
				game.player2Paddle.y = data.player2_y;
				game.player3Paddle.y = data.player3_y;
				game.player4Paddle.y = data.player4_y;
				game.players[0].playerscore = data.player1_score;
				game.players[1].playerscore = data.player2_score;
				game.players[2].playerscore = data.player3_score;
				game.players[3].playerscore = data.player4_score;
				game.ball.ballSpeedX = data.ballSpeedX;// Update ball speed
				if (data.gamefinished) {
					fetch("/resetgameMultiplayer")
						.then(response => response.json())
						.then(data => {
							game.ball.ballX = data.ballX;
							game.ball.ballY = data.ballY;
							game.player1Paddle.y = data.player1_y;
							game.player2Paddle.y = data.player2_y;
							game.player3Paddle.y = data.player3_y;
							game.player4Paddle.y = data.player4_y;
							game.players[0].playerscore = data.player1_score;
							game.players[1].playerscore = data.player2_score;
							game.players[2].playerscore = data.player3_score;
							game.players[3].playerscore = data.player4_score;
						});
				}
			});
	}
}
function drawMultiplayerGame(): void {
	const playerColors = ["#ff4c4c", "#4cff4c", "#4c4cff", "#ffff4c"];
	const paddles = [
		game.player1Paddle,
		game.player2Paddle,
		game.player3Paddle,
		game.player4Paddle
	];
	judgeGame();
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial";
	for (let i = 0; i < 4; i++) {
		ctx.fillStyle = playerColors[i];
		ctx.fillText(
			game.players[i].name + ": " + game.players[i].playerscore,
			10,
			25 + i * 25
		);
	}
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 125); // Display ball speed
	calculatePaddleCoordsMultiplayer();
	drawMiddlePathMultiplayer();
	drawCircleMultiplayer(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	for (let i = 0; i < paddles.length; i++) {
		ctx.fillStyle = playerColors[i];
		ctx.fillRect(
			paddles[i].x,
			paddles[i].y,
			paddles[i].width,
			paddles[i].height
		);
	}
	getGameStatusMultiplayer();
	requestAnimationFrame(drawMultiplayerGame);
}

export function startMultiplayerGame(play1: string, play2: string, play3: string, play4: string) {
	if (game.multiplayerGameStart) {
		const player1 = new Player(play1);
		const player2 = new Player(play2);
		const player3 = new Player(play3);
		const player4 = new Player(play4);

		game.players = [player1, player2, player3, player4];
		drawMultiplayerGame();
	}
}