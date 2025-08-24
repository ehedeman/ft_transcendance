import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { game, rounds, accaleration } from "./server.js";
import { GameInfo } from './serverStructures.js';

let gameFinished = false;

function touchingPaddle1Multiplayer(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player1Paddle.x + game.player1Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player1Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player1Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player1Paddle.y + game.player1Paddle.height
	);
}

function touchingPaddle2Multiplayer(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player2Paddle.x + game.player2Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player2Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player2Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player2Paddle.y + game.player2Paddle.height
	);
}

function touchingPaddle3Multiplayer(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player3Paddle.x + game.player3Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player3Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player3Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player3Paddle.y + game.player3Paddle.height
	);
}

function touchingPaddle4Multiplayer(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player4Paddle.x + game.player4Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player4Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player4Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player4Paddle.y + game.player4Paddle.height
	);
}

function calculateBallCoordsMultiplayer(): void {
	if (game.ball.ballPaused) return; // Skip updates if the ball is paused
	game.ball.ballX += game.ball.ballSpeedX;
	game.ball.ballY += game.ball.ballSpeedY;

	// Bounce off top and bottom
	if (game.ball.ballY - game.ball.ballRadius < 0 || game.ball.ballY + game.ball.ballRadius > game.canvas.height) {
		game.ball.ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1Multiplayer() && game.ball.ballSpeedX > 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX < 30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
	} else if (touchingPaddle2Multiplayer() && game.ball.ballSpeedX < 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
	} else if (touchingPaddle3Multiplayer() && game.ball.ballSpeedX > 0) {
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration;
		} else {
			game.ball.ballSpeedX *= -1;
		}
	} else if (touchingPaddle4Multiplayer() && game.ball.ballSpeedX < 0) {
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration;
		} else {
			game.ball.ballSpeedX *= -1;
		}
	}

	// Check if ball passed player1 (left side)
	if (game.ball.ballX - game.ball.ballRadius < 0) {
		game.player1.playerscore++;
		game.player3.playerscore++;
		resetBallMultiplayer();
	}

	// Check if ball passed player2 (right side)
	if (game.ball.ballX + game.ball.ballRadius > game.canvas.width) {
		game.player2.playerscore++;
		game.player4.playerscore++;
		resetBallMultiplayer();
	}
}

function resetBallMultiplayer(): void {
	game.ball.ballX = game.canvas.width / 2;
	game.ball.ballY = game.canvas.height / 2;
	game.ball.ballPaused = true;
	game.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
	game.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;
	game.player1Paddle.y = game.canvas.height / 2 - game.player1Paddle.height / 2;
	game.player2Paddle.y = game.canvas.height / 2 - game.player2Paddle.height / 2;
	game.player3Paddle.y = game.canvas.height / 2 - game.player3Paddle.height / 2;
	game.player4Paddle.y = game.canvas.height / 2 - game.player4Paddle.height / 2;
}

function resetGameMultiplayer(): void {
	game.player1.playerscore = 0;
	game.player2.playerscore = 0;
	game.player3.playerscore = 0;
	game.player4.playerscore = 0;
	resetBallMultiplayer();
	gameFinished = false;
}

export function interactWithMultiplayerGame(app: FastifyInstance, db: any, game: GameInfo) {
	app.get('/pressSpaceMultiplayer', async (request: FastifyRequest, reply: FastifyReply) => {
		const { sender } = request.query as { sender: string };
		game.ball.ballPaused = !game.ball.ballPaused;
		reply.send({ status: game.ball.ballPaused ? 'Ball paused' : 'Ball unpaused' });
	});
	app.get('/pressWMultiplayer', (request: FastifyRequest, reply: FastifyReply) => {
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
		if (sender === game.player3.name) {
			if (game.player3Paddle.y > 0 && !game.ball.ballPaused) {
				game.player3Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 3 moved up' });
		}
		if (sender === game.player4.name) {
			if (game.player4Paddle.y > 0 && !game.ball.ballPaused) {
				game.player4Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 4 moved up' });
		}
	});
	app.get('/pressSMultiplayer', (request: FastifyRequest, reply: FastifyReply) => {
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
		if (sender === game.player3.name) {
			if (game.player3Paddle.y + game.player3Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player3Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 3 moved down' });
		}
		if (sender === game.player4.name) {
			if (game.player4Paddle.y + game.player4Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player4Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 4 moved down' });
		}
	});
	app.get('/pressArrowUpMultiplayer', (request: FastifyRequest, reply: FastifyReply) => {
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
		if (sender === game.player3.name) {
			if (game.player3Paddle.y > 0 && !game.ball.ballPaused) {
				game.player3Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 3 moved up' });
		}
		if (sender === game.player4.name) {
			if (game.player4Paddle.y > 0 && !game.ball.ballPaused) {
				game.player4Paddle.y -= 5; // Move paddle up
			}
			reply.send({ status: 'Paddle 4 moved up' });
		}
	});
	app.get('/pressArrowDownMultiplayer', (request: FastifyRequest, reply: FastifyReply) => {
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
		if (sender === game.player3.name) {
			if (game.player3Paddle.y + game.player3Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player3Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 3 moved down' });
		}
		if (sender === game.player4.name) {
			if (game.player4Paddle.y + game.player4Paddle.height < game.canvas.height && !game.ball.ballPaused) {
				game.player4Paddle.y += 5; // Move paddle down
			}
			reply.send({ status: 'Paddle 4 moved down' });
		}
	});
	app.get('/resetgameMultiplayer', async (request: FastifyRequest, reply: FastifyReply) => {
		resetGameMultiplayer();
		reply.type('application/json').send({
			ballX: game.ball.ballX,
			ballY: game.ball.ballY,
			player1_y: game.player1Paddle.y,
			player2_y: game.player2Paddle.y,
			player3_y: game.player3Paddle.y,
			player4_y: game.player4Paddle.y,
			player1_score: game.player1.playerscore,
			player2_score: game.player2.playerscore,
			player3_score: game.player3.playerscore,
			player4_score: game.player4.playerscore,
			gamefinished: gameFinished,
		});
	});

	app.get('/getstatusMultiplayer', async (request: FastifyRequest, reply: FastifyReply) => {
		reply.type('application/json').send({
			ballX: game.ball.ballX,
			ballY: game.ball.ballY,
			player1_y: game.player1Paddle.y,
			player2_y: game.player2Paddle.y,
			player3_y: game.player3Paddle.y,
			player4_y: game.player4Paddle.y,
			player1_score: game.player1.playerscore,
			player2_score: game.player2.playerscore,
			player3_score: game.player3.playerscore,
			player4_score: game.player4.playerscore,
			gamefinished: gameFinished,
			ballSpeedX: game.ball.ballSpeedX,
		});
	});
}

export function updateMultiplayerGame(db: any): void {
	if (!gameFinished && game.multiplayerMode) {
		if (game.player1.playerscore === rounds) {
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player3.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player4.name);
			// stmt = db.prepare("INSERT INTO matchHistory (player1, player2, winner, loser, score_player1, score_player2) VALUES (?, ?, ?, ?, ?, ?)");
			// stmt.run(game.player1.name, game.player2.name, game.player1.name, game.player2.name, game.player1.playerscore, game.player2.playerscore);
			gameFinished = true;
			game.multiplayerMode = false;
		}
		if (game.player2.playerscore === rounds) {
			let stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player2.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player1.name);
			stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE full_name = ?");
			stmt.run(game.player4.name);
			stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE full_name = ?");
			stmt.run(game.player3.name);
			// stmt = db.prepare("INSERT INTO matchHistory (player1, player2, winner, loser, score_player1, score_player2) VALUES (?, ?, ?, ?, ?, ?)");
			// stmt.run(game.player1.name, game.player2.name, game.player2.name, game.player1.name, game.player1.playerscore, game.player2.playerscore);
			gameFinished = true;
			game.multiplayerMode = false;
		}
		calculateBallCoordsMultiplayer();
	}
}