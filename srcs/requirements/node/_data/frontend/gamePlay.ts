import { game, ctx, keysPressed, rounds, handleKeydown, handleKeyup, navigate } from './index.js';
import { showWinnerScreen, tournamentLogic, tournamentFinished, tournamentStart } from "./tournament.js";
import { GameInfo, pageIndex, TournamentStage } from './frontendStructures.js';
import { twoPlayerMatchStart } from './twoPlayerMatch_local.js';

export function callGameEventListeners(game: GameInfo) {
	document.getElementById("playSelect")?.addEventListener("change", (event: Event) => {
		const playSelect = document.getElementById("playSelect") as HTMLSelectElement;
		const target = event.target as HTMLSelectElement;
		const selectedOption = target.value;
		if (playSelect)
			playSelect.selectedIndex = 0;
		if (selectedOption) {
			switch (selectedOption) {
				case "tournament":
					navigate(game.availablePages[pageIndex.TOURNAMENT], "", game);
					// tournamentStart(game);
					break;
				case "multiplayer":
					navigate(game.availablePages[pageIndex.MULTIPLAYER], "", game);
					break
				case "1v1":
					navigate(game.availablePages[pageIndex.MATCH], "", game);
					// twoPlayerMatchStart(game);
					break
				default:
					break;
			}
		}
	});
}

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

function calculatePaddleCoords(game: GameInfo): void {
	if (!game.remoteMode && !game.multiplayerMode) {
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
}

function getGameStatus(): void {
	if (!game.gamefinished && !game.remoteMode && !game.multiplayerMode && !game.multiplayerGameStart) {
		var length = game.t.matches.length;
		fetch("/getstatus")
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
					fetch("/resetgame")
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

function singlePlayerGame(): void {
	if (game.players[0].playerscore === rounds) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
		showWinnerScreen(game, game.players[0].name);
	}
	if (game.players[1].playerscore === rounds) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
		showWinnerScreen(game, game.players[1].name);
	}
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.players[0].name + ": " + game.players[0].playerscore, 10, 25);
	ctx.fillText(game.players[1].name + ": " + game.players[1].playerscore, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoords(game);
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);
	getGameStatus();
}

function tournamentGame(): number {
	getGameStatus();
	if (tournamentLogic(game) === 1)
		return (0);
	var length = game.t.matches.length;
	if (game.t.stage === TournamentStage.Complete)
		return 1;
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.t.matches[length - 1].player1.name + ": " + game.t.matches[length - 1].player1.score, 10, 25);
	ctx.fillText(game.t.matches[length - 1].player2.name + ": " + game.t.matches[length - 1].player2.score, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoords(game);
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);

	return 0;
}

export function updateGame(): void {
	if (!game.t.finishScreenRunning && game.t.stage !== TournamentStage.Registration && !game.remoteMode && !game.multiplayerMode && !game.multiplayerGameStart) {
		if (game.players.length >= 2 && !game.tournamentLoopActive && !game.remoteMode && !game.multiplayerMode && !game.multiplayerGameStart) {
			console.log("Single Player Game");
			singlePlayerGame();
		}
		else if (game.tournamentLoopActive) {
			tournamentGame();
		}
	}
	requestAnimationFrame(updateGame);
}

export function clickWinnerScreenContinue() {
	document.getElementById("WinnerScreenContinue")?.addEventListener("click", () => {
		// fetch("/gameContinue");
		if (game.tournamentLoopActive && game.t.stage === TournamentStage.Complete)
			tournamentFinished(game);
		else if (!game.tournamentLoopActive) {
			game.players.splice(0, game.players.length);
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
		}
		const winnerScreen = document.getElementById("WinnerScreen");
		if (winnerScreen) winnerScreen.style.display = "none";
		document.addEventListener("keydown", handleKeydown);
		document.addEventListener("keyup", handleKeyup);
		getGameStatus();
	});
}
