import { game, rounds, accaleration } from "./server.js";
import { GameInfo } from "./serverStructures.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

let gameFinished = false;
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
	} else if (touchingPaddle2() && game.ball.ballSpeedX < 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
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
	gameFinished = false;
}

export function updateGame(db: any): void {
	if (!gameFinished && !game.remoteMode) {
		if (game.player1.playerscore === rounds) {
			console.log('player1 name:', game.player1.name);
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("INSERT INTO matchHistory (player1, player2, winner, loser, score_player1, score_player2) VALUES (?, ?, ?, ?, ?, ?)");
			stmt.run(game.player1.name, game.player2.name, game.player1.name, game.player2.name, game.player1.playerscore, game.player2.playerscore);
			gameFinished = true;
		}
		if (game.player2.playerscore === rounds) {
			console.log('player2 name:', game.player2.name);
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("INSERT INTO matchHistory (player1, player2, winner, loser, score_player1, score_player2) VALUES (?, ?, ?, ?, ?, ?)");
			stmt.run(game.player1.name, game.player2.name, game.player2.name, game.player1.name, game.player1.playerscore, game.player2.playerscore);
			gameFinished = true;
		}
		calculateBallCoords();
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

	app.get('/resetgame', async (request: FastifyRequest, reply: FastifyReply) => {
		resetGame();
		reply.type('application/json').send({
			ballX: game.ball.ballX,
			ballY: game.ball.ballY,
			player1_y: game.player1Paddle.y,
			player2_y: game.player2Paddle.y,
			player1_score: game.player1.playerscore,
			player2_score: game.player2.playerscore,
			gamefinished: gameFinished,
		});
	});

	app.get('/getstatus', async (request: FastifyRequest, reply: FastifyReply) => {
		reply.type('application/json').send({
			ballX: game.ball.ballX,
			ballY: game.ball.ballY,
			player1_y: game.player1Paddle.y,
			player2_y: game.player2Paddle.y,
			player1_score: game.player1.playerscore,
			player2_score: game.player2.playerscore,
			gamefinished: gameFinished,
			ballSpeedX: game.ball.ballSpeedX,
		});
	});

	app.get('/makeTheBackendHaveThePlayer', async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, opponent } = request.query as { username: string; opponent: string };
		game.player1.name = username;
		game.player2.name = opponent;
		reply.send({ status: 'Player added to game' });
	});
}