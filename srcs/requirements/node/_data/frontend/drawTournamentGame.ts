import { game, rounds, ctx, keysPressed } from "./index.js"
import { showWinnerScreen } from "./tournament.js";

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

function calculatePaddleCoords(): void {
	if (game.localMode && !game.remoteMode && !game.multiplayerMode && game.tournamentLoopActive) {
		if (keysPressed["space"]) {
			fetch(`/pressSpace`);
		}
		if (keysPressed["ArrowUp"]) {
			fetch(`/pressArrowUp`);
		}
		if (keysPressed["ArrowDown"]) {
			fetch(`/pressArrowDown`);
		}
		if (keysPressed["w"]) {
			fetch(`/pressW`);
		}
		if (keysPressed["s"]) {
			fetch(`/pressS`);
		}
	}
}

import { GameInfo, pageIndex, Player, TournamentStage } from './frontendStructures.js';
import { twoPlayerMatchStart } from './twoPlayerMatch_local.js';
import { tournamentLogic } from "./tournament.js"


export function drawTournamentGame() {
    if (tournamentLogic(game) === 1)
        return 0;
    var length = game.t.matches.length;
    if (game.t.stage === TournamentStage.Complete)
        return 1;
    ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    const playerColors = ["#00ccff", "#ff6666"]; 
    ctx.font = "20px Arial";
    ctx.fillStyle = playerColors[0];
    ctx.fillText(
        game.t.matches[length - 1].player1.name + ": " + game.t.matches[length - 1].player1.score,
        10,
        25
    );
    ctx.fillStyle = playerColors[1];
    ctx.fillText(
        game.t.matches[length - 1].player2.name + ": " + game.t.matches[length - 1].player2.score,
        10,
        50
    );
    ctx.fillStyle = "white";
    ctx.fillText(
        "ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0),
        10,
        75
    );
    calculatePaddleCoords();
    drawMiddlePath();
    drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
    ctx.fillStyle = playerColors[0];
    ctx.fillRect(
        game.player1Paddle.x,
        game.player1Paddle.y,
        game.player1Paddle.width,
        game.player1Paddle.height
    );
    ctx.fillStyle = playerColors[1];
    ctx.fillRect(
        game.player2Paddle.x,
        game.player2Paddle.y,
        game.player2Paddle.width,
        game.player2Paddle.height
    );
}


export function handleTournamentGameInfo(data: any): void {
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
	var length = game.t.matches.length;
	game.ball.ballX = ballX;
	game.ball.ballY = ballY;
	game.player1Paddle.y = player1_y;
	game.player2Paddle.y = player2_y;
	game.t.matches[length - 1].player1.score = player1_score;
	game.t.matches[length - 1].player2.score = player2_score;
	game.gamefinished = gamefinished;
	game.ball.ballSpeedX = ballSpeedX;
	drawTournamentGame();
}