// import { canvas } from "../frontend/index.ts";

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

	player1: Player;
	player2: Player;

	rounds: number;	//amounts of rounds to play -> make uneven to avoid draw

	canvas: canvasInfo;

	constructor() 
	{
		this.canvas = new canvasInfo();
		this.ball = new BallInfo();
		this.player1Paddle = new playerPaddle();
		this.player2Paddle = new playerPaddle();
		this.player1 = new Player("Player 1");
		this.player2 = new Player("Player 2");
		this.player1Paddle.x = canvas.width - 100; // Right side
		this.player2Paddle.x = 100; // Left side
	
		this.rounds = 1;	//amounts of rounds to play -> make uneven to avoid draw

		this.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
		this.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;
	}
}
export type loginInfo = {
	name: string;
	username: string;
	password: string;
	country: string;
};
