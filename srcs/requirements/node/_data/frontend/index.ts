
import { GameInfo, Player, TournamentStage } from "./utils/structures";
import { tournamentEnd, tournamentLogic, tournamentPlayGame } from "./utils/tournament";

export let canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 600;

let game = new GameInfo();

canvas.style.background = "black";


/*---------------------------events declaration-----------------------------------*/

canvas.addEventListener("click", () => game.canvas_focus = true);
document.addEventListener("click", (e: MouseEvent) => {
	if (e.target !== canvas) game.canvas_focus = false;
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
	if (e.code === "Space" && game.ball.ballPaused) {
		game.ball.ballPaused = false;
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
	game.playersGeneral.push({
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
	resetButton.addEventListener("click", () => tournamentEnd(0, game));
	showRegistrationModal(game.t.maxPlayers);
});

document.getElementById("registrationForm")?.addEventListener("submit", (e) => {
	e.preventDefault();
	const playerInputs = Array.from(document.querySelectorAll("#playerInputs input")) as HTMLInputElement[];
	game.t.players = [];
	for (const input of playerInputs) {
		if (!input.value.trim()) {
			alert("Name cannot be empty!");
			return;
		}
		game.t.players.push({
			name: input.value.trim(),
			playerNumber: game.t.players.length + 1,
			gamesWon: 0,
			score: 0
		});
	}
	hideRegistrationModal();
	game.t.stage = TournamentStage.Regular1;
	game.tournamentLoopActive = true;
	game.gameLoopActive = false;
	tournamentPlayGame(game);
	// tournamentStart();
});

document.getElementById("cancelRegistration")?.addEventListener("click", () => {
	hideRegistrationModal();
	tournamentEnd(1, game);
});

/*---------------------------function declaration---------------------------------*/

function drawMiddlePath(): void {
	game.ctx.strokeStyle = "white";
	game.ctx.lineWidth = 2;
	for (let y = 0; y < game.window_height; y += 20) {
		game.ctx.beginPath();
		game.ctx.moveTo(game.window_width / 2, y);
		game.ctx.lineTo(game.window_width / 2, y + 10);
		game.ctx.stroke();
	}
}


function drawCircle(x: number, y: number, radius: number): void {
	game.ctx.beginPath();
	game.ctx.arc(x, y, radius, 0, Math.PI * 2);
	game.ctx.fillStyle = "white";
	game.ctx.fill();
	game.ctx.closePath();
}


function touchingPaddle1(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player1PaddleX + game.pad_width &&
		game.ball.ballX + game.ball.ballRadius > game.player1PaddleX &&
		game.ball.ballY + game.ball.ballRadius > game.player1PaddleY &&
		game.ball.ballY - game.ball.ballRadius < game.player1PaddleY + game.pad_height
	);
}

function touchingPaddle2(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player2PaddleX + game.pad_width &&
		game.ball.ballX + game.ball.ballRadius > game.player2PaddleX &&
		game.ball.ballY + game.ball.ballRadius > game.player2PaddleY &&
		game.ball.ballY - game.ball.ballRadius < game.player2PaddleY + game.pad_height
	);
}

function resetPlayer(game: GameInfo): void {
	game.player1PaddleX = game.player1StartCoordsX;
	game.player1PaddleY = game.player1StartCoordsY;

	game.player2PaddleX = game.player2StartCoordsX;
	game.player2PaddleY = game.player2StartCoordsY;
}

function resetBall(game: GameInfo): void 
{
	game.ball.ballX = game.window_width / 2;
	game.ball.ballY = game.window_height / 2;
	game.ball.ballPaused = true;
}


function calculateBallCoords(): void {
	if (game.ball.ballPaused) return; // Skip updates if the ball is paused
	game.ball.ballX += game.ball.ballSpeedX;
	game.ball.ballY += game.ball.ballSpeedY;

	// Bounce off top and bottom
	if (game.ball.ballY - game.ball.ballRadius < 0 || game.ball.ballY + game.ball.ballRadius > game.window_height) {
		game.ball.ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1() && game.ball.ballSpeedX > 0) {
		game.ball.ballSpeedX *= -1;
	} else if (touchingPaddle2() && game.ball.ballSpeedX < 0) {
		game.ball.ballSpeedX *= -1;
	}

	// Check if ball passed player1 (left side)
	if (game.ball.ballX - game.ball.ballRadius < 0) {
		if (game.tournamentLoopActive)
			game.currentMatch.player1.score++;
		else
			game.player1_score++;
		resetBall(game);
		resetPlayer(game);
	}

	// Check if ball passed player2 (right side)
	if (game.ball.ballX + game.ball.ballRadius > game.window_width) {
		if (game.tournamentLoopActive)
			game.currentMatch.player2.score++;
		else
			game.player2_score++;
		resetBall(game);
		resetPlayer(game);
	}
}

function calculatePaddleCoords():void
{
	if (game.ball.ballPaused)
		return ;
	if (keysPressed["ArrowUp"] && game.player1PaddleY > 0) game.player1PaddleY -= 5;
	if (keysPressed["ArrowDown"] && game.player1PaddleY + game.pad_height < game.window_height)
		game.player1PaddleY += 5;
	if (keysPressed["w"] && game.player2PaddleY > 0)
		game.player2PaddleY -= 5;
	if (keysPressed["s"] && game.player2PaddleY + game.pad_height < game.window_height)
		game.player2PaddleY += 5;
}

function searchPlayer(name: string, array: Player[]): number {
	for (let i = 0; i < array.length; i++) {
		if (array[i].name === name) {
			return i;
		}
	}
	return -1; // Player not found
}

function resetGame(game: GameInfo): void {
	game.player1_score = 0;
	game.player2_score = 0;
	// reset the name of the playersGeneral
}

function gameGraphics(): void
{
	if (game.player1_score === game.rounds || game.player2_score === game.rounds)
	{
		var winner = "";
		var loser = "";
		if (game.player1_score === game.rounds)
		{
			winner = game.player1_name;
			loser = game.player2_name;
		}
		else if (game.player2_score === game.rounds)
		{
			winner = game.player2_name;
			loser = game.player1_name;
		}
		alert(winner + " wins!");
		const winnerIndex = searchPlayer(winner, game.playersGeneral);
		if (winnerIndex >= 0) {
			game.playersGeneral[winnerIndex].gamesWon++;
		}
		const loserIndex = searchPlayer(loser, game.playersGeneral);
		if (loserIndex >= 0) {
			game.playersGeneral[loserIndex].gamesLost++;
		}
		resetGame(game);
	}
	game.player1_name = game.playersGeneral[0]?.name || "Player 1";
	game.player2_name = game.playersGeneral[1]?.name || "Player 2";
	game.ctx.clearRect(0, 0, game.window_width, game.window_height);
	game.ctx.font = "20px Arial"; game.ctx.fillStyle = "white";
	game.ctx.fillText(game.player1_name + ": " + game.player1_score, 10, 25);
	game.ctx.fillText(game.player2_name + ": " + game.player2_score, 10, 50);
	calculatePaddleCoords();
	calculateBallCoords();
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	game.ctx.fillStyle = "white";
	game.ctx.fillRect(game.player1PaddleX, game.player1PaddleY, game.pad_width, game.pad_height);
	game.ctx.fillRect(game.player2PaddleX, game.player2PaddleY, game.pad_width, game.pad_height);
}

function tournamentGraphics(game: GameInfo): void
{
	game.ctx.clearRect(0, 0, game.window_width, game.window_height);
	game.ctx.font = "20px Arial"; game.ctx.fillStyle = "white";
	game.ctx.fillText(game.currentMatch.player1.name + ": " + game.currentMatch.player1.score, 10, 25);
	game.ctx.fillText(game.currentMatch.player2.name + ": " + game.currentMatch.player2.score, 10, 50);
	calculatePaddleCoords();
	calculateBallCoords();
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	game.ctx.fillStyle = "white";
	game.ctx.fillRect(game.player1PaddleX, game.player1PaddleY, game.pad_width, game.pad_height);
	game.ctx.fillRect(game.player2PaddleX, game.player2PaddleY, game.pad_width, game.pad_height);
}

function updateGame(): void 
{
	if (!game.tournamentLoopActive && game.gameLoopActive)
		gameGraphics();
	else if (game.tournamentLoopActive && !game.gameLoopActive && game.t.stage !== TournamentStage.Registration)
	{
		tournamentLogic(game);
		if (game.t.stage === TournamentStage.Complete)
			return ;
		tournamentGraphics(game);
	}
	requestAnimationFrame(updateGame);
}

/*------------------------------actual code start---------------------------------*/


updateGame();