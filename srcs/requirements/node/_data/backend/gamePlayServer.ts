import { game, rounds, accaleration } from "./server.js";
import { GameInfo } from "./serverStructures.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

function touchingPaddle1(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player1Paddle.x + game.player1Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player1Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player1Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player1Paddle.y + game.player1Paddle.height
	);
}

function touchingPaddle2(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player2Paddle.x + game.player2Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player2Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player2Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player2Paddle.y + game.player2Paddle.height
	);
}

function resetBall(): void {
	game.ball.ballX = game.canvas.width / 2;
	game.ball.ballY = game.canvas.height / 2;
	game.ball.ballPaused = true;
	game.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
	game.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;
	game.player1Paddle.y = game.canvas.height / 2 - game.player1Paddle.height / 2;
	game.player2Paddle.y = game.canvas.height / 2 - game.player2Paddle.height / 2;
}

function calculateBallCoords(): void {
	if (game.ball.ballPaused) return; // Skip updates if the ball is paused
	game.ball.ballX += game.ball.ballSpeedX;
	game.ball.ballY += game.ball.ballSpeedY;

	// Bounce off top and bottom
	if (game.ball.ballY - game.ball.ballRadius < 0 || game.ball.ballY + game.ball.ballRadius > game.canvas.height) {
		game.ball.ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1() && game.ball.ballSpeedX > 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX < 30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
		if (game.ball.ballSpeedY < 10) {
			game.ball.ballSpeedY *= Math.random() > 0.5 ? (Math.random() + 3) * Math.random() : -(Math.random() + 3) * Math.random(); // Add some randomness to vertical speed
		}
	} else if (touchingPaddle2() && game.ball.ballSpeedX < 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
		if (game.ball.ballSpeedY < 10) {
			game.ball.ballSpeedY *= Math.random() > 0.5 ? (Math.random() + 3) * Math.random() : -(Math.random() + 3) * Math.random();
		}
	}

	// Check if ball passed player1 (left side)
	if (game.ball.ballX - game.ball.ballRadius < 0) {
		game.player1.playerscore++;
		resetBall();
	}

	// Check if ball passed player2 (right side)
	if (game.ball.ballX + game.ball.ballRadius > game.canvas.width) {
		game.player2.playerscore++;
		resetBall();
	}
}

function resetGame(): void {
	game.player1.playerscore = 0;
	game.player2.playerscore = 0;
	resetBall();
}

function sendGameinfo() {
	if (game.sockets.has(game.localGameSender)) {
		const socket = game.sockets.get(game.localGameSender);
		if (socket && !game.tournamentLoopActive) {
			socket.send(JSON.stringify({
				type: "localGameInfo",
				player1_name: game.player1.name,
				player2_name: game.player2.name,
				ballX: game.ball.ballX,
				ballY: game.ball.ballY,
				player1_y: game.player1Paddle.y,
				player2_y: game.player2Paddle.y,
				player1_score: game.player1.playerscore,
				player2_score: game.player2.playerscore,
				gamefinished: game.gameFinished,
				ballSpeedX: game.ball.ballSpeedX,
			}));
		}
		if (socket && game.tournamentLoopActive) {
			socket.send(JSON.stringify({
				type: "tournamentGameInfo",
				player1_name: game.player1.name,
				player2_name: game.player2.name,
				ballX: game.ball.ballX,
				ballY: game.ball.ballY,
				player1_y: game.player1Paddle.y,
				player2_y: game.player2Paddle.y,
				player1_score: game.player1.playerscore,
				player2_score: game.player2.playerscore,
				gamefinished: game.gameFinished,
				ballSpeedX: game.ball.ballSpeedX,
			}));
		}
	}
}

export function updateGame(db: any): void {
	if (game.localMode && !game.gameFinished && !game.remoteMode && !game.multiplayerMode) {
		console.log(`Updating game for player1: ${game.player1.name}, player2: ${game.player2.name}`);
		if (game.player1.playerscore === rounds) {
			console.log("========================================================================================");
			console.log('player1 name:', game.player1.name);
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("INSERT INTO matchHistory (player1, player2, player3, player4, winner, loser, score_player1, score_player2, score_player3, score_player4, matchType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			if (!game.tournamentLoopActive) {
				stmt.run(game.player1.name, game.player2.name, 'null', 'null', game.player1.name, game.player2.name, game.player1.playerscore, game.player2.playerscore, 0, 0, 'local');
			} else {
				stmt.run(game.player1.name, game.player2.name, 'null', 'null', game.player1.name, game.player2.name, game.player1.playerscore, game.player2.playerscore, 0, 0, 'tournament');
			}
			game.gameFinished = true;
			game.localMode = false;
		}
		if (game.player2.playerscore === rounds) {
			console.log("========================================================================================");
			console.log('player2 name:', game.player2.name);
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("INSERT INTO matchHistory (player1, player2, player3, player4, winner, loser, score_player1, score_player2, score_player3, score_player4, matchType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			if (!game.tournamentLoopActive) {
				stmt.run(game.player1.name, game.player2.name, 'null', 'null', game.player2.name, game.player1.name, game.player2.playerscore, game.player1.playerscore, 0, 0, 'local');
			} else {
				stmt.run(game.player1.name, game.player2.name, 'null', 'null', game.player2.name, game.player1.name, game.player2.playerscore, game.player1.playerscore, 0, 0, 'tournament');
			}
			game.gameFinished = true;
			game.localMode = false;
		}
		calculateBallCoords();
		sendGameinfo();
		if (game.gameFinished) {
			resetGame();
		}
	}
}

export function interactWithGame(app: FastifyInstance, game: GameInfo) {
	app.get('/pressspace', async (request: FastifyRequest, reply: FastifyReply) => {
		game.ball.ballPaused = !game.ball.ballPaused;
		reply.send({ status: game.ball.ballPaused ? 'Ball paused' : 'Ball unpaused' });
	});

	app.get('/pressArrowUp', async (request: FastifyRequest, reply: FastifyReply) => {
		if (game.player1Paddle.y > 0 && !game.ball.ballPaused) {
			game.player1Paddle.y -= 5; // Move paddle up
		}
		reply.send({ status: 'Paddle 1 moved up' });
	});

	app.get('/pressArrowDown', async (request: FastifyRequest, reply: FastifyReply) => {
		if (game.player1Paddle.y + game.player1Paddle.height < game.canvas.height && !game.ball.ballPaused) {
			game.player1Paddle.y += 5; // Move paddle down
		}
		reply.send({ status: 'Paddle 1 moved down' });
	});

	app.get('/pressW', async (request: FastifyRequest, reply: FastifyReply) => {
		if (game.player2Paddle.y > 0 && !game.ball.ballPaused) {
			game.player2Paddle.y -= 5; // Move paddle up
		}
		reply.send({ status: 'Paddle 2 moved up' });
	});

	app.get('/pressS', async (request: FastifyRequest, reply: FastifyReply) => {
		if (game.player2Paddle.y + game.player2Paddle.height < game.canvas.height && !game.ball.ballPaused) {
			game.player2Paddle.y += 5; // Move paddle down
		}
		reply.send({ status: 'Paddle 2 moved down' });
	});

	app.get('/makeTheBackendHaveThePlayer', async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, opponent } = request.query as { username: string; opponent: string };
		game.player1.name = username;
		game.player2.name = opponent;
		game.player1.playerscore = 0;
		game.player2.playerscore = 0;
		game.gameFinished = false;
		reply.send({ status: 'Player added to game' });
	});

	app.get('/localMode', async (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };
		if (game.localMode || game.remoteMode || game.multiplayerMode || game.tournamentLoopActive) {
			return reply.status(403).send({ error: 'Game is already in progress' });
		}
		game.localGameSender = sender;
		game.localMode = true;
		reply.send({ status: 'Local mode activated' });
	});

	app.get('/endLocalMode', async (request: FastifyRequest, reply: FastifyReply) => {
		game.localMode = false;
		reply.send({ status: 'Local mode deactivated' });
	});

	app.get('/tournamentContinue', async (request: FastifyRequest, reply: FastifyReply) => {
		game.localMode = true;
		reply.send({ status: 'Tournament continued' });
	});

	app.get('/startTournament', async (request: FastifyRequest, reply: FastifyReply) => {
		game.tournamentLoopActive = true;
		reply.send({ status: 'Tournament started' });
	});

	app.get("/endTournament", async (request: FastifyRequest, reply: FastifyReply) => {
		if (game.tournamentLoopActive) {
			game.localMode = false;
			game.tournamentLoopActive = false;
			game.gameFinished = true;
			resetGame();
		}
		reply.send({ status: 'Tournament ended' });
	});
	// 	app.get('/leaveGamePressed', async (request: FastifyRequest, reply: FastifyReply) => {
	// 		game.localMode = false;
	// 		resetGame();
	// 		sendGameinfo();
	// 		reply.send({ status: 'Left the game.' });
	// 	});
}
