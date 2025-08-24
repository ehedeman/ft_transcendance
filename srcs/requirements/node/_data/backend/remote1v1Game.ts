import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { game, rounds, accaleration } from "./server.js";
import { GameInfo } from './serverStructures.js';

let gameFinished = false;

function touchingPaddle1Remote1v1(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player1Paddle.x + game.player1Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player1Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player1Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player1Paddle.y + game.player1Paddle.height
	);
}

function touchingPaddle2Remote1v1(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player2Paddle.x + game.player2Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player2Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player2Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player2Paddle.y + game.player2Paddle.height
	);
}

function calculateBallCoordsRemote1v1(): void {
	if (game.ball.ballPaused) return; // Skip updates if the ball is paused
	game.ball.ballX += game.ball.ballSpeedX;
	game.ball.ballY += game.ball.ballSpeedY;

	// Bounce off top and bottom
	if (game.ball.ballY - game.ball.ballRadius < 0 || game.ball.ballY + game.ball.ballRadius > game.canvas.height) {
		game.ball.ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1Remote1v1() && game.ball.ballSpeedX > 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX < 30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
		game.ball.ballSpeedY *= Math.random() > 0.5 ? (Math.random() + 3) * Math.random() : -(Math.random() + 3) * Math.random();
	} else if (touchingPaddle2Remote1v1() && game.ball.ballSpeedX < 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
		game.ball.ballSpeedY *= Math.random() > 0.5 ? (Math.random() + 3) * Math.random() : -(Math.random() + 3) * Math.random();
	}

	// Check if ball passed player1 (left side)
	if (game.ball.ballX - game.ball.ballRadius < 0) {
		game.player1.playerscore++;
		resetBallRemote1v1();
	}

	// Check if ball passed player2 (right side)
	if (game.ball.ballX + game.ball.ballRadius > game.canvas.width) {
		game.player2.playerscore++;
		resetBallRemote1v1();
	}
}

function resetBallRemote1v1(): void {
	game.ball.ballX = game.canvas.width / 2;
	game.ball.ballY = game.canvas.height / 2;
	game.ball.ballPaused = true;
	game.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
	game.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;
	game.player1Paddle.y = game.canvas.height / 2 - game.player1Paddle.height / 2;
	game.player2Paddle.y = game.canvas.height / 2 - game.player2Paddle.height / 2;
}

function resetGameRemote1v1(): void {
	game.player1.playerscore = 0;
	game.player2.playerscore = 0;
	resetBallRemote1v1();
	gameFinished = false;
}

export function interactWithRemote1v1Game(app: FastifyInstance, db: any, game: GameInfo) {
	app.get('/pressSpaceRemote1v1', async (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };
		game.ball.ballPaused = !game.ball.ballPaused;
		reply.send({ status: game.ball.ballPaused ? 'Ball paused' : 'Ball unpaused' });
	});
	app.get('/pressWRemote1v1', (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };

		if (sender === game.player1.name) {
			if (game.player1Paddle.y > 0 && !game.ball.ballPaused) {
				game.player1Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 1 moved up' });
		}
		if (sender === game.player2.name) {
			if (game.player2Paddle.y > 0 && !game.ball.ballPaused) {
				game.player2Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 2 moved up' });
		}
	});
	app.get('/pressSRemote1v1', (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };

		if (sender === game.player1.name) {
			if (game.player1Paddle.y + game.player1Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player1Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 1 moved down' });
		}
		if (sender === game.player2.name) {
			if (game.player2Paddle.y + game.player2Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player2Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 2 moved down' });
		}
	});
	app.get('/pressArrowUpRemote1v1', (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };

		if (sender === game.player1.name) {
			if (game.player1Paddle.y > 0 && !game.ball.ballPaused) {
				game.player1Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 1 moved up' });
		}
		if (sender === game.player2.name) {
			if (game.player2Paddle.y > 0 && !game.ball.ballPaused) {
				game.player2Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 2 moved up' });
		}
	});
	app.get('/pressArrowDownRemote1v1', (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };

		if (sender === game.player1.name) {
			if (game.player1Paddle.y + game.player1Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player1Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 1 moved down' });
		}
		if (sender === game.player2.name) {
			if (game.player2Paddle.y + game.player2Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player2Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 2 moved down' });
		}
	});
	app.get('/resetgameRemote1v1', async (request: FastifyRequest, reply: FastifyReply) => {
		resetGameRemote1v1();
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

	app.get('/getstatusRemote1v1', async (request: FastifyRequest, reply: FastifyReply) => {
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
}

export function updateRemote1v1Game(db: any): void {
	if (!gameFinished && game.remoteMode) {
		if (game.player1.playerscore === rounds) {
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("INSERT INTO matchHistory (player1, player2, winner, loser, score_player1, score_player2) VALUES (?, ?, ?, ?, ?, ?)");
			stmt.run(game.player1.name, game.player2.name, game.player1.name, game.player2.name, game.player1.playerscore, game.player2.playerscore);
			gameFinished = true;
			game.remoteMode = false;
		}
		if (game.player2.playerscore === rounds) {
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("INSERT INTO matchHistory (player1, player2, winner, loser, score_player1, score_player2) VALUES (?, ?, ?, ?, ?, ?)");
			stmt.run(game.player1.name, game.player2.name, game.player2.name, game.player1.name, game.player1.playerscore, game.player2.playerscore);
			gameFinished = true;
			game.remoteMode = false;
		}
		calculateBallCoordsRemote1v1();
	}
}