import { userInfo } from "./serverStructures.js";

export class canvasInfo {
	width: number;
	height: number;
	constructor() {
		this.width = 900;
		this.height = 600;
	}
}

//just for login/registration, not the game
export type PlayerRegistration = {
		name: string;
		username: string;
		password: string;
		country: string;
		avatar?: string;
};

export type PlayerLogin = {
		username: string;
		password: string;
};

let canvas = new canvasInfo();// maybe I can delete this

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


export type TournamentPlayer = {
		name: string;
		score: number;
};

export type Match = {
	player1: TournamentPlayer;
	player2: TournamentPlayer;
	winner: TournamentPlayer;
	loser: TournamentPlayer;
};

export enum TournamentStage {
	Not_Running,
	Registration,
	Playing,
	Regular1,	//	first round -> player1 vs player3
	Regular2, //	second round -> player2 vs player4
	Final,		//	winner vs winner
	Consolation,	//  loser vs loser
	Complete
}

export class Tournament {
	matchOrder: TournamentPlayer[];
	players: TournamentPlayer[];
	matches: Match[];
	currentRound: number;
	stage: TournamentStage;
	winners: TournamentPlayer[];
	losers: TournamentPlayer[];
	defaultPlayer: TournamentPlayer;
	finishScreenRunning: boolean;
	constructor ()
	{
		this.matchOrder = [];
		this.players = [];
		this.matches = [];
		this.currentRound = 0;
		this.stage = TournamentStage.Not_Running;
		this.winners = [];
		this.losers = [];
		this.finishScreenRunning = false;
		this.defaultPlayer = {
			name: "default",
			score: 0,
		};
	}
}

// from each of those, going back = HOME
// needs to match "available pages" array
export enum pageIndex {
	HOME,
	SETTINGS,
	TOURNAMENT,
	MULTIPLAYER,
	MATCH,
	CHECKING_PROFILE,
	REGISTER,
	LOGIN,
}	//match = 1v1

// export type pages = {
// 	page0: string;
// 	page1: string;
// 	page2: string;
// 	page3: string;
// 	page4: string;
// 	page5: string;
// }	//add more as needed

export type gameSnapShot = {
	players: Player[];
	websocket?: WebSocket;
	currentlyLoggedIn: Player;
}

export type renderInfo = {
	view: string;
	info: string;
	snapShot: gameSnapShot;
}


export class GameInfo {
	ball: BallInfo;
	player1Paddle: playerPaddle;
	player2Paddle: playerPaddle;

	t: Tournament;

	players: Player[];

	canvas: canvasInfo;

	tournamentLoopActive: boolean;

	websocket?: WebSocket;// for the websocket connection

	sendMessageTo: string;

	friendList: string[];

	chatHistory: string[];

	friendRequestList: string[];

	rejectedFriendRequests: string[];

	currentlyLoggedIn: Player;

	availablePages: string[];

	gamefinished: boolean;

	userInfoTemp: userInfo;

	remoteMode: boolean;

	multiplayerMode: boolean;

	constructor() 
	{
		this.canvas = new canvasInfo();
		this.ball = new BallInfo();
		this.player1Paddle = new playerPaddle();
		this.player2Paddle = new playerPaddle();
		
		this.t = new Tournament();

		this.players = [];
	
		this.player1Paddle.x = canvas.width - 100; // Right side
		this.player2Paddle.x = 100; // Left side

		this.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
		this.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;

		this.tournamentLoopActive = false;

		this.sendMessageTo = "";

		this.friendList = [];

		this.chatHistory = [];

		this.friendRequestList = [];

		this.rejectedFriendRequests = [];

		this.currentlyLoggedIn = { name:"default", gamesLost:0, gamesWon: 0, playerscore: 0	};
	
		this.availablePages = ["home", "settings", "tournament", "multiplayer", "match", "profile", "register", "login", "settings-login", "remote-match", "local-match"];

		this.gamefinished =false;

		this.userInfoTemp = 
		{
			id: 0,
			Full_Name: "default",
			Alias : "defaulty",
			Country : "defaultLand",
			password_hash : "defaultPassword",
			avatar_url : "default.png",
			status : "default",
			updated_at : "default",
			created_at : "default",
		}

		this.remoteMode = false;

		this.multiplayerMode = false;
	}
}

