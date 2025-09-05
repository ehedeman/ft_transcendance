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


import { getFriendList, getFriendRequestList, getRejectedFriendRequests } from "./friendSystemFunctions.js";
import { getUserInfoAndCreateUserInterface, getUserMatchHistory, hideGeneralLoginModal } from "./login.js";
import { drawLocalGame } from './drawLocalGame.js';

export function clickWinnerScreenContinue(game: GameInfo) {
	document.getElementById("WinnerScreenContinue")?.addEventListener("click", () => {
		// fetch("/gameContinue");
		if (game.tournamentLoopActive && game.t.stage === TournamentStage.Complete){
			game.localMode = false;
			tournamentFinished(game);
		}
		else if (game.tournamentLoopActive && game.t.stage !== TournamentStage.Complete) {
			var length = game.t.matches.length;
			fetch(`/tournamentContinue?username=${encodeURIComponent(game.t.matches[length - 1].player1.name)}&opponent=${encodeURIComponent(game.t.matches[length - 1].player2.name)}`);
			//replace tournamentContinue with the new start of game
			game.gamefinished = false;
			game.localMode = true;
		}
		else if (!game.tournamentLoopActive) {
			game.players.splice(0, game.players.length);
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
		}
		if (game.localMode && !game.tournamentLoopActive) {
			game.localMode = false;
		}
		const winnerScreen = document.getElementById("WinnerScreen");
		if (winnerScreen) winnerScreen.classList.add("hidden");
		document.addEventListener("keydown", handleKeydown);
		document.addEventListener("keyup", handleKeyup);
		getFriendList(game.currentlyLoggedIn.name);
		getFriendRequestList(game.currentlyLoggedIn.name);
		const addFriend = document.getElementById("addFriend") as HTMLElement;
		if (addFriend) addFriend.classList.remove("hidden");
		getRejectedFriendRequests(game.currentlyLoggedIn.name);
		getUserMatchHistory(game.currentlyLoggedIn.name);
		document.getElementById("userStatusInterface")?.remove();
		getUserInfoAndCreateUserInterface(game.currentlyLoggedIn.name);
		hideGeneralLoginModal();
	});
}

import { Player } from "./frontendStructures.js"
import { hideEverything } from './screenDisplay.js';
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
		hideEverything();
	}
	game.gamefinished = gamefinished;
	game.ball.ballSpeedX = ballSpeedX;
	drawLocalGame();
}