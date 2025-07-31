let canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

type Player = {
	name: string;
	gamesWon: number;
	gamesLost: number;
};

type GameInfo = {
	player1PaddleX: number;
	player1PaddleY: number;
	player2PaddleX: number;
	player2PaddleY: number;
	pad_width: number;
	pad_height: number;
	window_width: number;
	window_height: number;
	player1StartCoordsX: number;
	player1StartCoordsY: number;
	player2StartCoordsX: number;
	player2StartCoordsY: number;
}

type BallInfo = {
	ballX: number;
	ballY: number;
	ballRadius: number;
	ballSpeedX: number;
	ballSpeedY: number;
	ballPaused: boolean;
}

type TournamentPlayer = {
	name: string;
	score: number;
	playerNumber: number;
	gamesWon: number;
	Place?: number;
}

type Match = {
  round: number;
  player1: TournamentPlayer;
  player2: TournamentPlayer;
  winner?: TournamentPlayer;
  loser?: TournamentPlayer;
};

enum TournamentStage {
  Registration,
  Playing,
  Regular1,	//	first round -> player1 vs player3
  Regular2, //	second round -> player2 vs player4
  Final,		//	winner vs winner
  Consolation,	//  loser vs loser
  Complete
}


interface TournamentInfo {
  players: TournamentPlayer[];
  currentlyPlaying: TournamentPlayer[];
  matchesPlayed: Match[];
  tournamentActive: boolean;
  maxPlayers: number;
  tournamentRounds?: number;
  currentRound: number;
  stage: TournamentStage;
  winners: TournamentPlayer[];
  losers: TournamentPlayer[];
}

/*---------------------------variable declaration---------------------------------*/

let playersGeneral: Player[] = [];

let tournamentLoopActive: boolean = false;
let gameLoopActive: boolean = true;

canvas.width = 900;
canvas.height = 600;
canvas.style.background = "black";
let canvas_focus: boolean = false;

let game: GameInfo = ({
	pad_width: 10,
	pad_height: 200,

	player1StartCoordsX: canvas.width - 100,
	player1StartCoordsY: canvas.height / 2 - 200 / 2,
	player2StartCoordsX: 100,
	player2StartCoordsY: canvas.height / 2 - 200 / 2,

	player1PaddleX: canvas.width - 100,
	player1PaddleY: canvas.height / 2 - 200 / 2,
	player2PaddleX: 100,
	player2PaddleY: canvas.height / 2 - 200 / 2,
	window_height: canvas.height,
	window_width: canvas.width,
});

let ball: BallInfo = {
	ballX: game.window_width / 2,
	ballY: game.window_height / 2,
	ballRadius: 10,
	ballSpeedX: 4,
	ballSpeedY: 3,
	ballPaused: true,
}

let player1_name = playersGeneral[0]?.name || "Player 1"; // Default to "Player 1" if not set
let player2_name = playersGeneral[1]?.name || "Player 2"; // Default to "Player 2" if not set
let player1_score = 0;
let player2_score = 0;
let rounds = 1;	//amounts of rounds to play -> make uneven to avoid draw

// import { tournamentEnd, tournamentGameLoop } from "./utils/tournament";
// import { tournamentStart } from "./utils/tournament";

let defaultPlayer: TournamentPlayer = {
	name: "default",
	score: 0,
	playerNumber: -1,
	gamesWon: -1,
	Place: -1,
}

let t: TournamentInfo = {
	players: [],
	currentlyPlaying: [],
	matchesPlayed: [],
	tournamentActive: false,
	maxPlayers: 4,
	currentRound: 0,
	stage: 0,
	winners: [],
	losers: []
};



let currentMatch: Match = {
	round: 0,
	player1: defaultPlayer,
	player2: defaultPlayer,
	winner: defaultPlayer,
	loser: defaultPlayer
}


/*---------------------------events declaration-----------------------------------*/

canvas.addEventListener("click", () => canvas_focus = true);
document.addEventListener("click", (e: MouseEvent) => {
	if (e.target !== canvas) canvas_focus = false;
});

const keysPressed: { [key: string]: boolean } = {};
document.addEventListener("keydown", (e: KeyboardEvent) => {
	keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e: KeyboardEvent) => {
	keysPressed[e.key] = false;
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
	const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
	if (scrollKeys.indexOf(e.key) !== -1) {
		e.preventDefault();
	}
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
	keysPressed[e.key] = true;
	// Start the ball movement when space is pressed
	if (e.code === "Space" && ball.ballPaused) {
		ball.ballPaused = false;
	}
});

document.getElementById("registerButton")?.addEventListener("click", () => {
	const player_name = prompt("Enter your name:");
	if (player_name === "") {
		alert("Name cannot be empty!");
		return;
	}
	else if (player_name === null) {
		alert("Registration cancelled.");
		return;
	}
	playersGeneral.push({
		name: player_name,
		gamesWon: 0,
		gamesLost: 0
	});
});

/*--------------------------register modal declaration----------------------------*/


function showRegistrationModal(playerCount: number) {
	const modal = document.getElementById("registrationModal") as HTMLDivElement;
	const playerInputs = document.getElementById("playerInputs") as HTMLDivElement;
	playerInputs.innerHTML = "";
	for (let i = 0; i < playerCount; i++) {
		const input = document.createElement("input");
		input.type = "text";
		input.placeholder = `Player ${i + 1} Name`;
		input.required = true;
		input.className = "mb-2 px-2 py-1 border rounded block";
		playerInputs.appendChild(input);
	}
	modal.style.display = "block";
}

function hideRegistrationModal() {
	const modal = document.getElementById("registrationModal") as HTMLDivElement;
	modal.style.display = "none";
}

document.getElementById("tournamentButton")?.addEventListener("click", () => {
	const registerButton = document.getElementById("registerButton");
	const tournamentButton = document.getElementById("tournamentButton");
	if (registerButton) registerButton.style.display = "none";
	if (tournamentButton) tournamentButton.style.display = "none";
	const resetButton = document.createElement("button");
	resetButton.id = "resetButton";
	resetButton.textContent = "Reset Tournament";
	resetButton.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4";
	resetButton.style.position = "absolute";
	resetButton.style.zIndex = "2";
	resetButton.style.left = "50%";
	resetButton.style.top = "10%";
	resetButton.style.transform = "translateX(-50%)";
	document.body.appendChild(resetButton);
	resetButton.addEventListener("click", () => tournamentEnd(0));
	showRegistrationModal(t.maxPlayers);
});

document.getElementById("registrationForm")?.addEventListener("submit", (e) => {
	e.preventDefault();
	const playerInputs = Array.from(document.querySelectorAll("#playerInputs input")) as HTMLInputElement[];
	t.players = [];
	for (const input of playerInputs) {
		if (!input.value.trim()) {
			alert("Name cannot be empty!");
			return;
		}
		t.players.push({
			name: input.value.trim(),
			playerNumber: t.players.length + 1,
			gamesWon: 0,
			score: 0
		});
	}
	hideRegistrationModal();
	t.stage = TournamentStage.Regular1;
	tournamentLoopActive = true;
	gameLoopActive = false;
	tournamentPlayGame();
	// tournamentStart();
});

document.getElementById("cancelRegistration")?.addEventListener("click", () => {
	hideRegistrationModal();
	tournamentEnd(1);
});

/*---------------------------tournament functions---------------------------------*/

function tournamentEnd(returnValue: number): number
{
	t.currentRound = 0;
	t.tournamentActive = false;
	gameLoopActive = true;
	tournamentLoopActive = false;
	location.reload();	//restores the regular interface
	if (t.players.length > 0)
		t.players.splice(0, t.players.length);
	return (returnValue);
}

function resetTournamentMatch(): void
{
	currentMatch.player1 = defaultPlayer;
	currentMatch.player2 = defaultPlayer;
	currentMatch.player1.score = 0;
	currentMatch.player2.score = 0;
	currentMatch.winner = defaultPlayer;
	currentMatch.loser = defaultPlayer;
	ball.ballPaused = true; // pause the ball after each match
	resetBall();
	resetPlayer();
}

function tournamentFindPlayer(name: string): number
{
	for (let i = 0; i < t.players.length; i++) {
		if (t.players[i].name === name) {
			return i;
		}
	}
	return -1; // Player not found
}

// stages need to be set from playing to Regular1, Regular2, Final, Consolation, Complete depending on amount of matches played
function tournamentPlayGame(): number 	//loop sets matches depending on stage !!! does not change the stage !!!
{
	var index = 0;
	var length = t.matchesPlayed.length;
	if (t.stage !== TournamentStage.Registration && t.stage !== TournamentStage.Playing && t.stage !== TournamentStage.Complete)
	{
		if (t.stage === TournamentStage.Regular1 || t.stage === TournamentStage.Regular2)
		{
			index = t.currentRound;
			// works cause we calculate the matches by taking the current and every second player
			t.matchesPlayed.push({
				round: 0,
				player1: t.players[index],
				player2: t.players[index + 2],
				winner: defaultPlayer,
				loser: defaultPlayer
			});
		}
		else if (t.stage === TournamentStage.Final || t.stage === TournamentStage.Consolation)	// loser vs loser | winner vs winner
		{
			const isWinnerMatch = (t.stage === TournamentStage.Final || t.stage === TournamentStage.Consolation) ? 1 : 0;
			// 1 -> winnerMatch, 0 -> loserMatch
			let player1 = defaultPlayer;
			let player2 = defaultPlayer;
			let player1Set = false;
			let player2Set = false;
			// for (let index = 0; index < t.players.length; index++) 
			// {
			// 	if ( t.players[index].gamesWon === isWinnerMatch)	//automatically searches for the winner or loser
			// 	{
			// 		console.log("Found player:", t.players[index].name, "with gamesWon:", t.players[index].gamesWon);
			// 		if (player2Set === false) {
			// 			player2 = t.players[index];
			// 			player2Set = true;
			// 		}
			// 		else if (player1Set === false) {
			// 			player1 = t.players[index];
			// 			player1Set = true;
			// 		}
			// 	}
			// }
			// //making sure there have been two players found
			// if (!player1Set && !player2Set)
			// {
			// 	alert("An error has occurred. Stopping tournament..");
			// 	return (tournamentEnd(1));
			// }	
			if (isWinnerMatch === 1)
			{
				player1 = t.winners[0] || defaultPlayer;;
				player2 = t.winners[1] || defaultPlayer;;
			}
			else if (isWinnerMatch === 0)
			{
				player1 = t.losers[0] || defaultPlayer;
				player2 = t.losers[1] || defaultPlayer;
			}
			if (player1.name === "default" || player2.name === "default")
			{
				alert("An error has occurred. Stopping tournament..");
				return (tournamentEnd(1));
			}
			player1.score = 0;
			player2.score = 0;
			t.matchesPlayed.push({
				round: 0,
				player1: player1,
				player2: player2,
				winner: defaultPlayer,
				loser: defaultPlayer
			});
		}
		length = t.matchesPlayed.length;
		t.stage = TournamentStage.Playing; //to make sure we don't loop through the same match again
		currentMatch = t.matchesPlayed[length - 1];
		t.currentRound++;
	}
	else if (t.stage === TournamentStage.Complete)
	{
		alert("Tournament is complete!");
		return (tournamentEnd(0));
	}
	return 0;
}

// function tournamentStart(): void 
// {
// 	gameLoopActive = false;
// 	// if (tournamentAddPlayers() === 1)
// 	// 	return ;
// 	// tournamentPlayGame();
// }

/*---------------------------function declaration---------------------------------*/

function drawMiddlePath(): void {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	for (let y = 0; y < game.window_height; y += 20) {
		ctx.beginPath();
		ctx.moveTo(game.window_width / 2, y);
		ctx.lineTo(game.window_width / 2, y + 10);
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


function touchingPaddle1(): boolean {
	return (
		ball.ballX - ball.ballRadius < game.player1PaddleX + game.pad_width &&
		ball.ballX + ball.ballRadius > game.player1PaddleX &&
		ball.ballY + ball.ballRadius > game.player1PaddleY &&
		ball.ballY - ball.ballRadius < game.player1PaddleY + game.pad_height
	);
}

function touchingPaddle2(): boolean {
	return (
		ball.ballX - ball.ballRadius < game.player2PaddleX + game.pad_width &&
		ball.ballX + ball.ballRadius > game.player2PaddleX &&
		ball.ballY + ball.ballRadius > game.player2PaddleY &&
		ball.ballY - ball.ballRadius < game.player2PaddleY + game.pad_height
	);
}

function resetPlayer(): void {
	game.player1PaddleX = game.player1StartCoordsX;
	game.player1PaddleY = game.player1StartCoordsY;

	game.player2PaddleX = game.player2StartCoordsX;
	game.player2PaddleY = game.player2StartCoordsY;
}

function resetBall(): void {
	ball.ballX = game.window_width / 2;
	ball.ballY = game.window_height / 2;
	ball.ballPaused = true;
}


function calculateBallCoords(): void {
	if (ball.ballPaused) return; // Skip updates if the ball is paused
	ball.ballX += ball.ballSpeedX;
	ball.ballY += ball.ballSpeedY;

	// Bounce off top and bottom
	if (ball.ballY - ball.ballRadius < 0 || ball.ballY + ball.ballRadius > game.window_height) {
		ball.ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1() && ball.ballSpeedX > 0) {
		ball.ballSpeedX *= -1;
	} else if (touchingPaddle2() && ball.ballSpeedX < 0) {
		ball.ballSpeedX *= -1;
	}

	// Check if ball passed player1 (left side)
	if (ball.ballX - ball.ballRadius < 0) {
		if (tournamentLoopActive)
			currentMatch.player1.score++;
		else
			player1_score++;
		resetBall();
		resetPlayer();
	}

	// Check if ball passed player2 (right side)
	if (ball.ballX + ball.ballRadius > game.window_width) {
		if (tournamentLoopActive)
			currentMatch.player2.score++;
		else
			player2_score++;
		resetBall();
		resetPlayer();
	}
}

function calculatePaddleCoords():void
{
	if (ball.ballPaused)
		return ;
	if (keysPressed["ArrowUp"] && game.player1PaddleY > 0) game.player1PaddleY -= 5;
	if (keysPressed["ArrowDown"] && game.player1PaddleY + game.pad_height < game.window_height)
		game.player1PaddleY += 5;
	if (keysPressed["w"] && game.player2PaddleY > 0)
		game.player2PaddleY -= 5;
	if (keysPressed["s"] && game.player2PaddleY + game.pad_height < game.window_height)
		game.player2PaddleY += 5;
}

function searchPlayer(name: string): number {
	for (let i = 0; i < playersGeneral.length; i++) {
		if (playersGeneral[i].name === name) {
			return i;
		}
	}
	return -1; // Player not found
}

function resetGame(): void {
	player1_score = 0;
	player2_score = 0;
	// reset the name of the playersGeneral
}

function gameGraphics(): void
{
	if (player1_score === rounds || player2_score === rounds)
	{
		var winner = "";
		var loser = "";
		if (player1_score === rounds)
		{
			winner = player1_name;
			loser = player2_name;
		}
		else if (player2_score === rounds)
		{
			winner = player2_name;
			loser = player1_name;
		}
		alert(winner + " wins!");
		const winnerIndex = searchPlayer(winner);
		if (winnerIndex >= 0) {
			playersGeneral[winnerIndex].gamesWon++;
		}
		const loserIndex = searchPlayer(loser);
		if (loserIndex >= 0) {
			playersGeneral[loserIndex].gamesLost++;
		}
		resetGame();
	}
	player1_name = playersGeneral[0]?.name || "Player 1";
	player2_name = playersGeneral[1]?.name || "Player 2";
	ctx.clearRect(0, 0, game.window_width, game.window_height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(player1_name + ": " + player1_score, 10, 25);
	ctx.fillText(player2_name + ": " + player2_score, 10, 50);
	calculatePaddleCoords();
	calculateBallCoords();
	drawMiddlePath();
	drawCircle(ball.ballX, ball.ballY, ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1PaddleX, game.player1PaddleY, game.pad_width, game.pad_height);
	ctx.fillRect(game.player2PaddleX, game.player2PaddleY, game.pad_width, game.pad_height);
}

function tournamentGraphics(): void
{
	ctx.clearRect(0, 0, game.window_width, game.window_height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(currentMatch.player1.name + ": " + currentMatch.player1.score, 10, 25);
	ctx.fillText(currentMatch.player2.name + ": " + currentMatch.player2.score, 10, 50);
	calculatePaddleCoords();
	calculateBallCoords();
	drawMiddlePath();
	drawCircle(ball.ballX, ball.ballY, ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1PaddleX, game.player1PaddleY, game.pad_width, game.pad_height);
	ctx.fillRect(game.player2PaddleX, game.player2PaddleY, game.pad_width, game.pad_height);
}

function tournamentLogic(): void
{
	var length = t.matchesPlayed.length;
	// if (length === 0) {
	// 	tournamentPlayGame();	//cause something didnt work before
	// 	length = t.matchesPlayed.length;
	// }
	console.log("Current Match:", currentMatch.player1.name, "vs", currentMatch.player2.name);
	if (currentMatch.player1.score === rounds || 
		currentMatch.player2.score === rounds)
	{
		// makes sure that once game is done it is set to correct stage
		if (t.currentRound === 1)
			t.stage = TournamentStage.Regular2;	//sets the stage to Regular1 after the first match
		else if (t.currentRound === 2)
			t.stage = TournamentStage.Final;
		else if (t.currentRound === 3)
			t.stage = TournamentStage.Consolation;
		else if (t.currentRound === 4)
			t.stage = TournamentStage.Complete;

		if (currentMatch.player1.score === rounds) {
			t.matchesPlayed[length - 1].winner = t.matchesPlayed[length - 1].player1;
			t.matchesPlayed[length - 1].loser = t.matchesPlayed[length - 1].player2;
		} else if (currentMatch.player2.score === rounds) {
			t.matchesPlayed[length - 1].winner = t.matchesPlayed[length - 1].player2;
			t.matchesPlayed[length - 1].loser = t.matchesPlayed[length - 1].player1;
		}

		alert(t.matchesPlayed[length - 1].winner?.name + " wins!");

		const winner = t.matchesPlayed[length - 1].winner?.name || "default";
		const loser = t.matchesPlayed[length - 1].loser?.name || "default";

		if (winner !== "default" && loser !== "default")
		{
			t.players[tournamentFindPlayer(winner)].gamesWon = 1;
			t.winners.push(t.players[tournamentFindPlayer(winner)]);
			t.losers.push(t.players[tournamentFindPlayer(loser)]);
		}	
		else
		{
			alert("An error has occurred. Stopping tournament..");
			tournamentEnd(1);
			return ;
		}
		resetTournamentMatch();
		tournamentPlayGame();
	}
}

function updateGame(): void 
{
	if (!tournamentLoopActive && gameLoopActive)
		gameGraphics();
	else if (tournamentLoopActive && !gameLoopActive && t.stage !== TournamentStage.Registration)
	{
		tournamentLogic();
		if (t.stage === TournamentStage.Complete)
			return ;
		tournamentGraphics();
	}
	requestAnimationFrame(updateGame);
}

/*------------------------------actual code start---------------------------------*/


updateGame();