
import { GameInfo, TournamentStage } from "./structures";


function t_resetPlayer(game: GameInfo): void {
	game.player1PaddleX = game.player1StartCoordsX;
	game.player1PaddleY = game.player1StartCoordsY;

	game.player2PaddleX = game.player2StartCoordsX;
	game.player2PaddleY = game.player2StartCoordsY;
}

function t_resetBall(game: GameInfo): void 
{
	game.ball.ballX = game.window_width / 2;
	game.ball.ballY = game.window_height / 2;
	game.ball.ballSpeedX= Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
	game.ball.ballSpeedY= (Math.random() * 2 - 1) * 3;
	game.ball.ballPaused = true;
}

export function tournamentEnd(returnValue: number, game: GameInfo): number
{
	game.t.currentRound = 0;
	game.t.tournamentActive = false;
	game.gameLoopActive = true;
	game.tournamentLoopActive = false;
	location.reload();	//restores the regular interface
	if (game.t.players.length > 0)
		game.t.players.splice(0, game.t.players.length);
	return (returnValue);
}

function resetTournamentMatch(game: GameInfo): void
{
	game.currentMatch.player1 = game.defaultPlayer;
	game.currentMatch.player2 = game.defaultPlayer;
	game.currentMatch.player1.score = 0;
	game.currentMatch.player2.score = 0;
	game.currentMatch.winner = game.defaultPlayer;
	game.currentMatch.loser = game.defaultPlayer;
	game.ball.ballPaused = true; // pause the ball after each match
	t_resetBall(game);
	t_resetPlayer(game);
}

function tournamentFindPlayer(name: string, game: GameInfo): number
{
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
	var length = game.t.matchesPlayed.length;
	if (game.t.stage !== TournamentStage.Registration && game.t.stage !== TournamentStage.Playing && game.t.stage !== TournamentStage.Complete)
	{
		if (game.t.stage === TournamentStage.Regular1 || game.t.stage === TournamentStage.Regular2)
		{
			index = game.t.currentRound;
			// works cause we calculate the matches by taking the current and every second player
			game.t.matchesPlayed.push({
				round: 0,
				player1: game.t.players[index],
				player2: game.t.players[index + 2],
				winner: game.defaultPlayer,
				loser: game.defaultPlayer
			});
		}
		else if (game.t.stage === TournamentStage.Final || game.t.stage === TournamentStage.Consolation)	// loser vs loser | winner vs winner
		{
			const isWinnerMatch = game.t.stage === TournamentStage.Final ? 1 : 0;
			console.log("isWinnerMatch:", isWinnerMatch, "stage:", game.t.stage);
			// 1 -> winnerMatch, 0 -> loserMatch
			let player1 = game.defaultPlayer;
			let player2 = game.defaultPlayer;
	
			if (isWinnerMatch === 1)
			{
				player1 = game.t.winners[0] || game.defaultPlayer;;
				player2 = game.t.winners[1] || game.defaultPlayer;;
			}
			else if (isWinnerMatch === 0)
			{
				player1 = game.t.losers[0] || game.defaultPlayer;
				player2 = game.t.losers[1] || game.defaultPlayer;
			}
			if (player1.name === "default" || player2.name === "default")
			{
				alert("An error has occurred. Stopping tournament..");
				return (tournamentEnd(1, game));
			}
			player1.score = 0;
			player2.score = 0;
			game.t.matchesPlayed.push({
				round: 0,
				player1: player1,
				player2: player2,
				winner: game.defaultPlayer,
				loser: game.defaultPlayer
			});
		}
		length = game.t.matchesPlayed.length;
		game.t.stage = TournamentStage.Playing; //to make sure we don't loop through the same match again
		game.currentMatch = game.t.matchesPlayed[length - 1];
		game.t.currentRound++;
	}
	else if (game.t.stage === TournamentStage.Complete)
	{
		alert("Tournament is complete!");
		return (tournamentEnd(0, game));
	}
	return 0;
}

export function tournamentLogic(game: GameInfo): void
{
	var length = game.t.matchesPlayed.length;

	console.log("Current Match:", game.currentMatch.player1.name, "vs", game.currentMatch.player2.name);

	if (game.currentMatch.player1.score === game.rounds || 
		game.currentMatch.player2.score === game.rounds)
	{
		// makes sure that once game is done it is set to correct stage
		console.log("Current round:", game.t.currentRound);
		if (game.t.currentRound === 1)
			game.t.stage = TournamentStage.Regular2;	//sets the stage to the oncoming stage
		else if (game.t.currentRound === 2)
			game.t.stage = TournamentStage.Final;
		else if (game.t.currentRound === 3)
			game.t.stage = TournamentStage.Consolation;
		else if (game.t.currentRound === 4)
			game.t.stage = TournamentStage.Complete;

		if (game.currentMatch.player1.score === game.rounds) 
		{  //sets the winner and loser of the current match
			game.t.matchesPlayed[length - 1].winner = game.t.matchesPlayed[length - 1].player1;
			game.t.matchesPlayed[length - 1].loser = game.t.matchesPlayed[length - 1].player2;
		}
		else if (game.currentMatch.player2.score === game.rounds) 
		{
			game.t.matchesPlayed[length - 1].winner = game.t.matchesPlayed[length - 1].player2;
			game.t.matchesPlayed[length - 1].loser = game.t.matchesPlayed[length - 1].player1;
		}

		alert(game.t.matchesPlayed[length - 1].winner?.name + " wins!");

		if (game.t.stage < TournamentStage.Consolation)  // if tournament is complete, we set the winners and losers
		{
			const winner = game.t.matchesPlayed[length - 1].winner?.name || "default";
			const loser = game.t.matchesPlayed[length - 1].loser?.name || "default";

			if (winner !== "default" && loser !== "default")
			{
				game.t.players[tournamentFindPlayer(winner, game)].gamesWon = 1;
				game.t.winners.push(game.t.players[tournamentFindPlayer(winner, game)]);    //adds players to general winners and losers
				game.t.losers.push(game.t.players[tournamentFindPlayer(loser,game)]);
			}	
			else
			{
				alert("An error has occurred. Stopping tournament..");
				tournamentEnd(1, game);
				return ;
			}
		}
		resetTournamentMatch(game);
		tournamentPlayGame(game);
	}
}