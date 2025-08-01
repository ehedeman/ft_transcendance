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
        this.name = "Anonymous";
        this.gamesWon = 0;
        this.gamesLost = 0;
        this.playerscore = 0;
    }
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
    player1Paddle: playerPaddle;
    player2Paddle: playerPaddle;

    player1: Player;
    player2: Player;

    ball: BallInfo;

	rounds: number;	//amounts of rounds to play -> make uneven to avoid draw

	canvas: canvasInfo;

    constructor() 
    {
        this.player1Paddle.x = 100;
        this.player2Paddle.x = canvas.width - 100;
    
        this.rounds = 1;	//amounts of rounds to play -> make uneven to avoid draw

        this.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
        this.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;
    }
}