import { Player } from "./frontendStructures.js"
import { game } from "./index.js"
import { drawGame } from "./drawGame.js"
import { hideEverything } from "./screenDisplay.js";

export function handleGameInfo(data: any) {
	const { player1_name, player2_name, ballX, ballY, player1_y, player2_y, player1_score, player2_score, gamefinished, ballSpeedX } = data as {
		player1_name: string;
		player2_name: string;
		ballX: number;
		ballY: number;
		player1_y: number;
		player2_y: number;
		player1_score: number;
		player2_score: number;
		gamefinished: boolean;
		ballSpeedX: number;
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
		game.remoteMode = true;
		hideEverything();
	}
	game.gamefinished = gamefinished;
	game.ball.ballSpeedX = ballSpeedX;
	drawGame();
}

export function startRemote1v1Game(name1: string, name2: string): void {
	const player1 = new Player(name1);
	const player2 = new Player(name2);

	game.players = [player1, player2];
	hideEverything();
}
