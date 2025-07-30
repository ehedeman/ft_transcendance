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
}