import { Player } from "./frontendStructures.js"
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

function getGameStatusRemote1v1(): void {
	if (!game.gamefinished) {
		var length = game.t.matches.length;
		fetch("/getstatusRemote1v1")
			.then(response => response.json())
			.then(data => {
				game.ball.ballX = data.ballX;
				game.ball.ballY = data.ballY;
				game.player1Paddle.y = data.player1_y;
				game.player2Paddle.y = data.player2_y;
				if (game.tournamentLoopActive && length) {
					game.t.matches[length - 1].player1.score = data.player1_score;
					game.t.matches[length - 1].player2.score = data.player2_score;
				}
				else {
					if (game.players.length >= 2) {
						game.players[0].playerscore = data.player1_score;
						game.players[1].playerscore = data.player2_score;
					}
				}
				game.ball.ballSpeedX = data.ballSpeedX;// Update ball speed
				if (data.gamefinished) {
					fetch("/resetgameRemote1v1")
						.then(response => response.json())
						.then(data => {
							game.ball.ballX = data.ballX;
							game.ball.ballY = data.ballY;
							game.player1Paddle.y = data.player1_y;
							game.player2Paddle.y = data.player2_y;
							if (game.tournamentLoopActive) {
								game.t.matches[length - 1].player1.score = data.player1_score;
								game.t.matches[length - 1].player2.score = data.player2_score;
							}
							else {
								game.players[0].playerscore = data.player1_score;
								game.players[1].playerscore = data.player2_score;
							}
						});
				}
			});
	}
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

function drawGameRemote1v1(): void {
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
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.players[0].name + ": " + game.players[0].playerscore, 10, 25);
	ctx.fillText(game.players[1].name + ": " + game.players[1].playerscore, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoordsRemote1v1();
	drawMiddlePathRemote1v1();
	drawCircleRemote1v1(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);
	getGameStatusRemote1v1();
	requestAnimationFrame(drawGameRemote1v1);
}

export function startRemote1v1Game(name1: string, name2: string): void {
	const player1 = new Player(name1);
	const player2 = new Player(name2);

	game.players = [player1, player2];
	drawGameRemote1v1();
}
