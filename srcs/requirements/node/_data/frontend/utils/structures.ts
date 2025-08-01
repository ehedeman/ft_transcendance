export type Player = {
    name: string;
    gamesWon: number;
    gamesLost: number;
};

export type BallInfo = {
    ballX: number;
    ballY: number;
    ballRadius: number;
    ballSpeedX: number;
    ballSpeedY: number;
    ballPaused: boolean;
}

export type TournamentPlayer = {
    name: string;
    score: number;
    playerNumber: number;
    gamesWon: number;
    Place?: number;
}

export type Match = {
  round: number;
  player1: TournamentPlayer;
  player2: TournamentPlayer;
  winner?: TournamentPlayer;
  loser?: TournamentPlayer;
};

export enum TournamentStage {
  Registration,
  Playing,
  Regular1,	//	first round -> player1 vs player3
  Regular2, //	second round -> player2 vs player4
  Final,		//	winner vs winner
  Consolation,	//  loser vs loser
  Complete
}


export interface TournamentInfo {
  matchOrder: TournamentPlayer[];
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

import { canvas } from "../index";
export class GameInfo {
    ctx: CanvasRenderingContext2D;
    canvas_focus: boolean;
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

    player1_name: string;
    player2_name: string;
    player1_score: number;
    player2_score: number;
    rounds: number;	
    playersGeneral: Player[];
    tournamentLoopActive: boolean;
    gameLoopActive: boolean;

    ball: BallInfo;
    currentMatch: Match;
    defaultPlayer: TournamentPlayer;
    t: TournamentInfo;

    constructor() 
    {
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.canvas_focus = false;
        this.pad_width = 10;
        this.pad_height = 200;

        this.player1StartCoordsX = canvas.width - 100;
        this.player1StartCoordsY = canvas.height / 2 - 200 / 2;
        this.player2StartCoordsX = 100;
        this.player2StartCoordsY = canvas.height / 2 - 200 / 2;

        this.player1PaddleX = canvas.width - 100;
        this.player1PaddleY = canvas.height / 2 - 200 / 2;
        this.player2PaddleX = 100;
        this.player2PaddleY = canvas.height / 2 - 200 / 2;
        this.window_height = canvas.height;
        this.window_width = canvas.width;
        this.playersGeneral= [];
    
        this.player1_name = this.playersGeneral[0]?.name || "Player 1"; // Default to "Player 1" if not set
        this.player2_name = this.playersGeneral[1]?.name || "Player 2"; // Default to "Player 2" if not set
        this.player1_score = 0;
        this.player2_score = 0;
        this.rounds = 1;	//amounts of rounds to play -> make uneven to avoid draw
    
        

        this.tournamentLoopActive = false;
        this.gameLoopActive = true;
        this.ball = {
        ballX: this.window_width / 2,
        ballY: this.window_height / 2,
        ballRadius: 10,

        ballSpeedX: Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3),
        ballSpeedY: (Math.random() * 2 - 1) * 3,
        ballPaused: true,
        };

        this.defaultPlayer = {
        name: "default",
        score: 0,
        playerNumber: -1,
        gamesWon: -1,
        Place: -1,
        };

        this.t = {
            matchOrder: [],
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

        this.currentMatch = {
                round: 0,
                player1: this.defaultPlayer,
                player2: this.defaultPlayer,
                winner: this.defaultPlayer,
                loser: this.defaultPlayer
        };
    }
}