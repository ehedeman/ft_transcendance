import { game } from "./index.js";
import { Player } from "./frontendStructures.js";
import { drawMultiplayerGame } from "./drawGameMultiplayer.js";
import { hideEverything } from "./screenDisplay.js";


export function handleMultiplayerGameInfo(data: any) {
	const { player1_name, player2_name, player3_name, player4_name, ballX, ballY, player1_y, player2_y, player3_y, player4_y, player1_score, player2_score, player3_score, player4_score, gamefinished, ballSpeedX } = data as {
		player1_name: string;
		player2_name: string;
		player3_name: string;
		player4_name: string;
		ballX: number;
		ballY: number;
		player1_y: number;
		player2_y: number;
		player3_y: number;
		player4_y: number;
		player1_score: number;
		player2_score: number;
		player3_score: number;
		player4_score: number;
		gamefinished: boolean;
		ballSpeedX: number;
	};
	game.ball.ballX = ballX;
	game.ball.ballY = ballY;
	game.player1Paddle.y = player1_y;
	game.player2Paddle.y = player2_y;
	game.player3Paddle.y = player3_y;
	game.player4Paddle.y = player4_y;
	if (game.players.length === 4) {
		game.players[0].playerscore = player1_score;
		game.players[1].playerscore = player2_score;
		game.players[2].playerscore = player3_score;
		game.players[3].playerscore = player4_score;
	} else {
		let player1 = new Player(player1_name);
		player1.playerscore = player1_score;
		let player2 = new Player(player2_name);
		player2.playerscore = player2_score;
		let player3 = new Player(player3_name);
		player3.playerscore = player3_score;
		let player4 = new Player(player4_name);
		player4.playerscore = player4_score;
		game.players.push(player1, player2, player3, player4);
		game.multiplayerMode = true;
		hideEverything();
	}
	game.gamefinished = gamefinished;
	game.ball.ballSpeedX = ballSpeedX;
	drawMultiplayerGame();
}

export function startMultiplayerGame(play1: string, play2: string, play3: string, play4: string) {
	const player1 = new Player(play1);
	const player2 = new Player(play2);
	const player3 = new Player(play3);
	const player4 = new Player(play4);

	game.players = [player1, player2, player3, player4];
	hideEverything();
}