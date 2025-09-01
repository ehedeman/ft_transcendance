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

function tournamentGame(): number {
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
		if (game.players.length === 2 && !game.tournamentLoopActive && !game.remoteMode && !game.multiplayerMode && !game.multiplayerGameStart) {
			console.log("Single Player Game");
			drawLocalGame();
		}
		else if (game.tournamentLoopActive) {
			tournamentGame();
		}
	}
	requestAnimationFrame(updateGame);
}

import { getFriendList, getFriendRequestList, getRejectedFriendRequests } from "./friendSystemFunctions.js";
import { getUserInfoAndCreateUserInterface, getUserMatchHistory, hideGeneralLoginModal } from "./login.js";
import { drawLocalGame } from './drawLocalGame.js';

export function clickWinnerScreenContinue(game: GameInfo) {
	document.getElementById("WinnerScreenContinue")?.addEventListener("click", () => {
		// fetch("/gameContinue");
		if (game.tournamentLoopActive && game.t.stage === TournamentStage.Complete)
			tournamentFinished(game);
		else if (game.tournamentLoopActive && game.t.stage !== TournamentStage.Complete) {
			fetch("/tournamentContinue");
			//replace tournamentContinue with the new start of game
			game.gamefinished = false;
		}
		else if (!game.tournamentLoopActive) {
			game.players.splice(0, game.players.length);
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
		}
		if (game.localMode) {
			game.localMode = false;
		}
		const winnerScreen = document.getElementById("WinnerScreen");
		if (winnerScreen) winnerScreen.style.display = "none";
		document.addEventListener("keydown", handleKeydown);
		document.addEventListener("keyup", handleKeyup);
		getFriendList(game.currentlyLoggedIn.name);
		getFriendRequestList(game.currentlyLoggedIn.name);
		const addFriend = document.getElementById("addFriend") as HTMLElement;
		if (addFriend) addFriend.style.display = "block";
		getRejectedFriendRequests(game.currentlyLoggedIn.name);
		getUserMatchHistory(game.currentlyLoggedIn.name);
		document.getElementById("userStatusInterface")?.remove();
		getUserInfoAndCreateUserInterface(game.currentlyLoggedIn.name);
		hideGeneralLoginModal();
	});
}

import { Player } from "./frontendStructures.js"
export function handleLocalGameInfo(data: any) {
	const { player1_name, player1_score, player2_name, player2_score, ballSpeedX, ballX, ballY, player1_y, player2_y, gamefinished } = data as {
		player1_name: string;
		player1_score: number;
		player2_name: string;
		player2_score: number;
		ballSpeedX: number;
		ballX: number;
		ballY: number;
		player1_y: number;
		player2_y: number;
		gamefinished: boolean;
	};
	game.ball.ballX = ballX;
	game.ball.ballY = ballY;
	game.player1Paddle.y = player1_y;
	game.player2Paddle.y = player2_y;
	if (game.players.length === 2) {
		game.players[0].playerscore = player1_score;
		game.players[1].playerscore = player2_score;
	} else {
		let player1 = new Player(player1_name);
		player1.playerscore = player1_score;
		let player2 = new Player(player2_name);
		player2.playerscore = player2_score;
		game.players.push(player1, player2);
		game.localMode = true;
	}
	game.gamefinished = gamefinished;
	game.ball.ballSpeedX = ballSpeedX;
	drawLocalGame();
}