// import { canvas } from "../frontend/index.ts";
import type { RawData, WebSocket } from 'ws';

export class canvasInfo {
	width: number;
	height: number;
	constructor() {
		this.width = 900;
		this.height = 600;
	}
}

let canvas = new canvasInfo();

export class Player {
	name: string;
	gamesWon: number;
	gamesLost: number;
	playerscore: number;

	constructor(name: string) {
		this.name = name? name : "Anonymous";
		this.gamesWon = 0;
		this.gamesLost = 0;
		this.playerscore = 0;
	}
}

export interface userInfo {
	id: number;
	Full_Name: string;
	Alias: string;
	Country: string;
	password_hash: string;
	avatar_url: string;
	status: string;
	updated_at: string;
	created_at: string;
}

export class BallInfo {
	ballX: number;
	ballY: number;
	ballRadius: number;
	ballSpeedX: number;
	ballSpeedY: number;
	ballPaused: boolean;

	constructor() {
		this.ballX = canvas.width / 2;
		this.ballY = canvas.height / 2;
		this.ballRadius = 10;
		this.ballSpeedX = 0;
		this.ballSpeedY = 0;
		this.ballPaused = true;
	}
}

export class playerPaddle {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor() {
		this.x = 0;
		this.y = canvas.height / 2 - 200 / 2;
		this.width = 10;
		this.height = 200;
	}
}

export class GameInfo {
	ball: BallInfo;
	player1Paddle: playerPaddle;
	player2Paddle: playerPaddle;
	player3Paddle: playerPaddle;
	player4Paddle: playerPaddle;

	player1: Player;
	player2: Player;
	player3: Player;
	player4: Player;

	rounds: number;	//amounts of rounds to play -> make uneven to avoid draw

	canvas: canvasInfo;

	sockets: Map<string, WebSocket>;

	localMode: boolean;

	remoteMode: boolean;

	multiplayerMode: boolean;

	multiplayerName: string[];

	gameFinished: boolean;

	localGameSender: string;

	constructor() 
	{
		this.canvas = new canvasInfo();
		this.ball = new BallInfo();
		this.player1Paddle = new playerPaddle();
		this.player2Paddle = new playerPaddle();
		this.player3Paddle = new playerPaddle();
		this.player4Paddle = new playerPaddle();
		this.player1 = new Player("Player 1");
		this.player2 = new Player("Player 2");
		this.player3 = new Player("Player 3");
		this.player4 = new Player("Player 4");
		this.player1Paddle.x = canvas.width - 100; // Right side
		this.player2Paddle.x = 100; // Left side
		this.player3Paddle.x = canvas.width * 3 / 4 - 50; // Middle right
		this.player4Paddle.x = canvas.width / 4 + 50; // Middle left

		this.rounds = 1;	//amounts of rounds to play -> make uneven to avoid draw

		this.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
		this.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;

		this.sockets = new Map<string, WebSocket>();

		this.localMode = false;

		this.remoteMode = false;

		this.multiplayerMode = false;

		this.multiplayerName = [];

		this.gameFinished = true;

		this.localGameSender = "";
	}
}
export type loginInfo = {
	name: string;
	username: string;
	password: string;
	country: string;
};
