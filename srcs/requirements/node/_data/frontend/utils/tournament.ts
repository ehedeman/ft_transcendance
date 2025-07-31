// // use 'export' for the function you want to use in the index.ts file
// // currently on hiatus since importing functions seems to interfere with the game itself
 
// /*---------------------------imported variables-----------------------------------*/

// import { ctx } from "../index";
// import { game } from "../index";
// import { ball } from "../index";
// import { rounds } from "../index";
// import { drawMiddlePath } from "../index";
// import { drawCircle } from "../index";
// import { touchingPaddle1 } from "../index";
// import { touchingPaddle2 } from "../index";
// import { resetBall } from "../index";
// import { resetPlayer } from "../index";
// import { calculatePaddleCoords } from "../index";



// /*---------------------------variable declaration---------------------------------*/

// let t: TournamentInfo = {
//   players: [],
//   currentlyPlaying: [],
//   matchesPlayed: [],
//   tournamentActive: false,
//   maxPlayers: 4,
//   //tournamentRounds: 4,
//   currentRound: 0,
//   stage: 0,
// };

// let defaultPlayer: TournamentPlayer = {
// 	name: "default",
// 	score: 0,
// 	playerNumber: -1,
// 	gamesWon: -1,
// 	Place: -1,
// }

// let currentMatch: Match = {
// 	round: 0,
// 	player1: defaultPlayer,
// 	player2: defaultPlayer,
// 	winner: defaultPlayer,
// 	loser: defaultPlayer
// }


// /*-------------------------------helper functions---------------------------------*/

// function TcalculateBallCoords(): void {
// 	if (ball.ballPaused) return; // Skip updates if the ball is paused
// 	ball.ballX += ball.ballSpeedX;
// 	ball.ballY += ball.ballSpeedY;

// 	// Bounce off top and bottom
// 	if (ball.ballY - ball.ballRadius < 0 || ball.ballY + ball.ballRadius > game.window_height) {
// 		ball.ballSpeedY *= -1;
// 	}

// 	// Check paddle collisions
// 	if (touchingPaddle1() && ball.ballSpeedX > 0) {
// 		ball.ballSpeedX *= -1;
// 	} else if (touchingPaddle2() && ball.ballSpeedX < 0) {
// 		ball.ballSpeedX *= -1;
// 	}

// 	// Check if ball passed player1 (left side)
// 	if (ball.ballX - ball.ballRadius < 0) {
// 		currentMatch.player1.score++;
// 		resetBall();
// 		resetPlayer();
// 	}

// 	// Check if ball passed player2 (right side)
// 	if (ball.ballX + ball.ballRadius > game.window_width) {
// 		currentMatch.player2.score++;
// 		resetBall();
// 		resetPlayer();
// 	}
// }

// /*---------------------------tournament functions---------------------------------*/

// export function tournamentEnd(returnValue: number): number
// {
// 	t.tournamentActive = false;
// 	location.reload();	//restores the regular interface
// 	if (t.players.length > 0)
// 		t.players.splice(0, t.players.length);
// 	return (returnValue);
// }


// function tournamentAddPlayers(): number 
// {
// 	for (let i = 0; i < 4 ; i++) 
// 	{
// 		const input = "Enter name for player " + (i + 1) + ":";
// 		const player_name = prompt(input);
// 		if (player_name === "")
// 		{
// 			alert("Name cannot be empty!");
// 			i--;
// 			continue ;
// 		}
// 		else if (player_name === null)
// 			return tournamentEnd(1);
// 		t.players.push
// 		({
// 			name: player_name,
// 			playerNumber: i + 1,
// 			gamesWon: 0,
// 			score: 0
// 		});
// 	}
// 	return (0);
// }

// function tournamentFindPlayer(name: string): number
// {
// 	for (let i = 0; i < t.players.length; i++) {
// 		if (t.players[i].name === name) {
// 			return i;
// 		}
// 	}
// 	return -1; // Player not found
// }

// export function tournamentGameLoop(): void
// {
// 	if (currentMatch.player1.score === rounds || 
// 		 currentMatch.player2.score === rounds)
// 	{
// 		return ;
// 	}

// 	ctx.clearRect(0, 0, game.window_width, game.window_height);
// 	ctx.font = "20px Arial"; ctx.fillStyle = "white";
// 	ctx.fillText(currentMatch.player1.name + ": " + currentMatch.player1.score, 10, 25);
// 	ctx.fillText(currentMatch.player1.name + ": " + currentMatch.player1.score, 10, 50);
// 	calculatePaddleCoords();
// 	TcalculateBallCoords();
// 	drawMiddlePath();
// 	drawCircle(ball.ballX, ball.ballY, ball.ballRadius);
// 	ctx.fillStyle = "white";
// 	ctx.fillRect(game.player1PaddleX, game.player1PaddleY, game.pad_width, game.pad_height);
// 	ctx.fillRect(game.player2PaddleX, game.player2PaddleY, game.pad_width, game.pad_height);
// 	requestAnimationFrame(tournamentGameLoop);
// }

// // function tournamentMatch(ongoingMatch: Match): void
// // {
// // 	currentMatch = ongoingMatch;
// // 	tournamentGameLoop();
// // 	if (currentMatch.player1.score === 5)
// // 		ongoingMatch.winner = ongoingMatch.player1;
// // 	else if (currentMatch.player2.score === 5)
// // 		ongoingMatch.winner = ongoingMatch.player2;
// // }

// function tournamentPlayGame(): number 
// {
// 	const amountRounds = t.tournamentRounds || 4;
// 	const length = t.matchesPlayed.length;
// 	for (let i = 0; i < amountRounds; i++)
// 	{
// 		if (i < 2)
// 		{
// 			t.matchesPlayed.push({
// 				round: 0,
// 				player1: t.players[i],
// 				player2: t.players[i + 2],
// 				winner: defaultPlayer,
// 				loser: defaultPlayer
// 			});	
// 		}
// 		else if (i > 1)	// loser vs loser | winner vs winner
// 		{
// 			const isWinnerMatch = (i === 2 || i === 3) ? 1 : 0;
// 			// 1 -> winnerMatch, 0 -> loserMatch
// 			t.matchesPlayed.push({
// 				round: 0,
// 				player1: defaultPlayer,
// 				player2: defaultPlayer,
// 				winner: defaultPlayer,
// 				loser: defaultPlayer
// 			});
// 			for (let index = 0; index < t.players.length; index++) {
// 				if ( t.players[index].gamesWon === isWinnerMatch)
// 				{
// 					if (t.matchesPlayed[length - 1].player1.name !== "default")
// 						t.matchesPlayed[length - 1].player2 = t.players[index];
// 					else
// 						t.matchesPlayed[length - 1].player1 = t.players[index];
// 				}
// 			}
// 			//making sure there have been two players found
// 			if (t.matchesPlayed[length - 1].player1.name === "default" || 
// 				t.matchesPlayed[length - 1].player2.name === "default")
// 			{
// 				alert("An error has occurred. Stopping tournament..");
// 				return (tournamentEnd(1));
// 			}
// 		}
// 		currentMatch = t.matchesPlayed[length - 1];
// 		tournamentGameLoop();
// 		if (currentMatch.player1.score === 5)
// 			t.matchesPlayed[length - 1].winner = t.matchesPlayed[length - 1].player1;
// 		else if (currentMatch.player2.score === 5)
// 			t.matchesPlayed[length - 1].winner = t.matchesPlayed[length - 1].player2;
// 		const winner = t.matchesPlayed[length - 1].winner?.name || "default";
// 		if (winner !== "default")
// 			t.players[tournamentFindPlayer(winner)].gamesWon = 1;
// 	}
// 	return 0;
// }

// export function tournamentStart(): void 
// {
// 	t.tournamentActive = true;
// 	t.tournamentRounds = t.maxPlayers;
// 	if (tournamentAddPlayers() === 1)
// 		return ;
// 	tournamentPlayGame();
// }

//test line