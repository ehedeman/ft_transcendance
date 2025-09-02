import { ctx, navigate } from "./index.js";
import { GameInfo, pageIndex, TournamentPlayer, TournamentStage } from "./frontendStructures.js";
// import { rounds } from "./server.js";
import { handleKeydown, handleKeyup } from "./index.js";
import { tournamentRegisterPlayers } from "./tournamentRegistration.js";
import { hideEverything, restoreScreenLoggedIn } from "./screenDisplay.js";

type tournamentPlacements = {
	username: string;
	place: number;
}

let rounds = 3;

export function showWinnerScreen(game: GameInfo, winner: string) {
	document.removeEventListener('keydown', handleKeydown);
	document.removeEventListener('keyup', handleKeyup);
	const winnerScreen = document.getElementById("WinnerScreen");
	if (winnerScreen) {
		winnerScreen.style.display = "block";
		const text = document.getElementById("WinnerScreenText");
		if (text)
			text.textContent = winner + " won!";
	}
}

function showTournamentResults(placements: tournamentPlacements[], game: GameInfo): void {
	game.t.finishScreenRunning = true;
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	const TournamentContinue = document.getElementById("tournamentFinishContinue");
	const resetButton = document.getElementById("tournamentResetButton");
	if (TournamentContinue) TournamentContinue.style.display = "block";
	if (resetButton) resetButton.style.display = "none";

	const results = document.getElementById("tournamentResults") as HTMLBodyElement;
	const placementList = document.getElementById("placementList") as HTMLBodyElement;

	placementList.innerHTML = "";
	placements.forEach((player, index) => {
		const listItem = document.createElement("li");
		listItem.textContent = `${player.username}`;
		placementList.appendChild(listItem);
	});

	results.style.display = "block";
}

export function tournamentFinished(game: GameInfo): void {
	var last = -1;
	var third = -1;
	var second = -1;
	var first = -1;
	if (game.t.matches[3].winner)	//winner of consolation match
		third = tournamentFindPlayer(game.t.matches[3].winner?.name, game);
	if (game.t.matches[3].loser)	//loser of consolation match
		last = tournamentFindPlayer(game.t.matches[3].loser?.name, game);
	if (game.t.matches[2].winner)	//winner of final match
		first = tournamentFindPlayer(game.t.matches[2].winner?.name, game);
	if (game.t.matches[2].loser)	//loser of final match
		second = tournamentFindPlayer(game.t.matches[2].loser?.name, game);
	if (last !== -1 && first !== -1 && third !== -1 && second !== -1) {
		var lastPlace = game.t.players[last];
		var thirdPlace = game.t.players[third];
		var secondPlace = game.t.players[second];
		var firstPlace = game.t.players[first];
		const placements: tournamentPlacements[] = [
			{ username: firstPlace.name, place: 1 },
			{ username: secondPlace.name, place: 2 },
			{ username: thirdPlace.name, place: 3 },
			{ username: lastPlace.name, place: 4 }
		];
		showTournamentResults(placements, game);
	}
}

export function tournamentEnd(returnValue: number, game: GameInfo): number {
	game.t.currentRound = 0;
	game.tournamentLoopActive = false;
	game.t.stage = TournamentStage.Not_Running;
	if (game.t.players.length > 0)
		game.t.players.splice(0, game.t.players.length);
	return (returnValue);
}


function tournamentFindPlayer(name: string, game: GameInfo): number {
	for (let i = 0; i < game.t.players.length; i++) {
		if (game.t.players[i].name === name) {
			return i;
		}
	}
	return -1; // Player not found
}

// stages need to be set from playing to Regular1, Regular2, Final, Consolation, Complete depending on amount of matches played
export function tournamentPlayGame(game: GameInfo): number 	//loop sets matches depending on stage !!! does not change the stage !!!
{
	var index = 0;
	var length = game.t.matches.length;
	console.log("Iteration CurrentRound: ", game.t.currentRound, " Current stage: ", game.t.stage);
	if (game.t.currentRound === 0)
		setMatchOrder(game);
	if (game.t.stage !== TournamentStage.Registration && game.t.stage !== TournamentStage.Complete) {
		if (game.t.stage === TournamentStage.Regular1 || game.t.stage === TournamentStage.Regular2) {
			index = game.t.currentRound;
			// works cause we calculate the matches by taking the current and every second player
			game.t.matches.push({
				player1: game.t.matchOrder[index],
				player2: game.t.matchOrder[index + 2],
				winner: game.t.defaultPlayer,
				loser: game.t.defaultPlayer
			});
			fetch(`/makeTheBackendHaveThePlayer?username=${encodeURIComponent(game.t.matchOrder[index].name)}&opponent=${encodeURIComponent(game.t.matchOrder[index + 2].name)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json();
				})
				.then(data => {
					game.localMode = true;
					console.log("Player added to game:", data);
				})
				.catch(error => {
					console.error("Error adding player to game:", error);
				});
		}
		else if (game.t.stage === TournamentStage.Final || game.t.stage === TournamentStage.Consolation)	// loser vs loser | winner vs winner
		{
			const isWinnerMatch = game.t.stage === TournamentStage.Final ? 1 : 0;
			console.log("isWinnerMatch:", isWinnerMatch, "stage:", game.t.stage);
			// 1 -> winnerMatch, 0 -> loserMatch
			let player1 = game.t.defaultPlayer;
			let player2 = game.t.defaultPlayer;

			if (isWinnerMatch === 1) {
				player1 = game.t.winners[0] || game.t.defaultPlayer;;
				player2 = game.t.winners[1] || game.t.defaultPlayer;;
			}
			else if (isWinnerMatch === 0) {
				player1 = game.t.losers[0] || game.t.defaultPlayer;
				player2 = game.t.losers[1] || game.t.defaultPlayer;
			}
			if (player1.name === "default" || player2.name === "default") {
				alert("An error has occurred. Stopping tournament..");
				return (tournamentEnd(1, game));
			}
			player1.score = 0;
			player2.score = 0;
			game.t.matches.push({
				player1: player1,
				player2: player2,
				winner: game.t.defaultPlayer,
				loser: game.t.defaultPlayer
			});
			fetch(`/makeTheBackendHaveThePlayer?username=${encodeURIComponent(game.t.matchOrder[index].name)}&opponent=${encodeURIComponent(game.t.matchOrder[index + 2].name)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error(response.statusText);
					}
					return response.json();
				})
				.then(data => {
					game.localMode = true;
					console.log("Player added to game:", data);
				})
				.catch(error => {
					console.error("Error adding player to game:", error);
				});
			console.log(player1.name, ": ", player1.score);
			console.log(player2.name, ": ", player2.score);
		}
		length = game.t.matches.length;
		game.t.matches[length - 1] = game.t.matches[length - 1];
		game.t.currentRound++;
	}
	else if (game.t.stage === TournamentStage.Complete) {
		// tournamentFinished(game);
		// return (tournamentEnd(0, game));
		return (0);
	}
	return 0;
}

function playerInMatch(game: GameInfo, player: TournamentPlayer): boolean {
	for (let index = 0; index < game.t.matchOrder.length; index++) {
		if (player.name === game.t.matchOrder[index].name)
			return true;
	}
	return false;
}

function setMatchOrder(game: GameInfo): void {
	const maxAttempts = 100;
	let attempts = 0;

	while (game.t.matchOrder.length < 4 && attempts < maxAttempts) {
		attempts++;

		const i = Math.floor(Math.random() * game.t.players.length);
		const candidate = game.t.players[i];

		if (!playerInMatch(game, candidate)) {
		game.t.matchOrder.push(candidate);
		} else {
		for (let index = 0; index < game.t.players.length; index++) {
			const fallback = game.t.players[index];
			if (!playerInMatch(game, fallback)) {
			game.t.matchOrder.push(fallback);
			break;
			}
		}
		}
	}

	if (attempts >= maxAttempts) {
		console.warn("Match order generation exceeded safe limit.");
	}
}

export function tournamentStart(game: GameInfo) {
	document.removeEventListener('keydown', handleKeydown);
	document.removeEventListener('keyup', handleKeyup);
	hideEverything();

	const resetButton = document.getElementById("tournamentResetButton");
	if (resetButton) resetButton.style.display = "block";
	game.t.stage = TournamentStage.Registration;
	fetch(`/localMode?sender=${game.currentlyLoggedIn.name}`)
		.then(response => {
			if (!response.ok) {
				alert("Failed to start tournament. Please try again.");
				restoreScreenLoggedIn();
				return;
			}
			tournamentRegisterPlayers(game);
		});
}

export function tournamentLogic(game: GameInfo): number {
	var length = game.t.matches.length;

	//console.log("Current Match:", game.t.matches[length -1].player1.name, "vs", game.t.matches[length -1].player2.name);

	if (game.t.matches[length - 1].player1.score === rounds ||
		game.t.matches[length - 1].player2.score === rounds) {
		// makes sure that once game is done it is set to correct stage
		// console.log("Current round:", game.t.currentRound);
		if (game.t.currentRound === 1)
			game.t.stage = TournamentStage.Regular2;	//sets the stage to the oncoming stage
		else if (game.t.currentRound === 2)
			game.t.stage = TournamentStage.Final;
		else if (game.t.currentRound === 3)
			game.t.stage = TournamentStage.Consolation;
		else if (game.t.currentRound === 4)
			game.t.stage = TournamentStage.Complete;

		if (game.t.matches[length - 1].player1.score === rounds) {  //sets the winner and loser of the current match
			game.t.matches[length - 1].winner = game.t.matches[length - 1].player1;
			game.t.matches[length - 1].loser = game.t.matches[length - 1].player2;
		}
		else if (game.t.matches[length - 1].player2.score === rounds) {
			game.t.matches[length - 1].winner = game.t.matches[length - 1].player2;
			game.t.matches[length - 1].loser = game.t.matches[length - 1].player1;
		}
		game.gamefinished = true;
		showWinnerScreen(game, game.t.matches[length - 1].winner.name);

		if (game.t.stage < TournamentStage.Consolation)  // if tournament is complete, we set the winners and losers
		{
			const winner = game.t.matches[length - 1].winner?.name || "default";
			const loser = game.t.matches[length - 1].loser?.name || "default";

			if (winner !== "default" && loser !== "default") {
				game.t.winners.push(game.t.players[tournamentFindPlayer(winner, game)]);    //adds players to general winners and losers
				game.t.losers.push(game.t.players[tournamentFindPlayer(loser, game)]);
			}
			else {
				alert("An error has occurred. Stopping tournament..");
				return tournamentEnd(1, game);
			}
		}
		game.ball.ballPaused = true;
		if (tournamentPlayGame(game) === 0)
			return (1);
	}
	return (0);
}