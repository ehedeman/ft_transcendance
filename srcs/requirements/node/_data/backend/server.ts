import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';

const app = fastify();

// import path from 'path';
import { fileURLToPath } from 'url';

import { GameInfo } from './structures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let game = new GameInfo();

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

let accaleration = 0.1; // Speed increase factor

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

function updateGame(): void {
	if (game.player1.playerscore === 5) {
		game.player1.gamesWon++;
		game.player2.gamesLost++;
		gameFinished = true;
	}
	if (game.player2.playerscore === 5) {
		game.player2.gamesWon++;
		game.player1.gamesLost++;
		gameFinished = true;
	}
	calculateBallCoords();
}

setInterval(() => {
	updateGame();
}, 1000 / 60);

app.register(fastifyStatic, {
	root: path.join(__dirname, '../public'),
	prefix: '/',
});

app.get('/', (request, reply) => {
	reply.type('text/html').sendFile('index.html');
});

app.get('/ping', async () => {
	return { pong: 'it works!' };
});

app.get('/pressspace', async (request, reply) => {
	game.ball.ballPaused = !game.ball.ballPaused;
	reply.send({ status: game.ball.ballPaused ? 'Ball paused' : 'Ball unpaused' });
});

app.get('/pressArrowUp', async (request, reply) => {
	if (game.player1Paddle.y > 0 && !game.ball.ballPaused) {
		game.player1Paddle.y -= 5; // Move paddle up
	}
	reply.send({ status: 'Paddle 1 moved up' });
});

app.get('/pressArrowDown', async (request, reply) => {
	if (game.player1Paddle.y + game.player1Paddle.height < game.canvas.height && !game.ball.ballPaused) {
		game.player1Paddle.y += 5; // Move paddle down
	}
	reply.send({ status: 'Paddle 1 moved down' });
});

app.get('/pressW', async (request, reply) => {
	if (game.player2Paddle.y > 0 && !game.ball.ballPaused) {
		game.player2Paddle.y -= 5; // Move paddle up
	}
	reply.send({ status: 'Paddle 2 moved up' });
});

app.get('/pressS', async (request, reply) => {
	if (game.player2Paddle.y + game.player2Paddle.height < game.canvas.height && !game.ball.ballPaused) {
		game.player2Paddle.y += 5; // Move paddle down
	}
	reply.send({ status: 'Paddle 2 moved down' });
});

app.get('/resetgame', async (request, reply) => {
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

app.get('/getstatus', async (request, reply) => {
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

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) throw err;
	console.log(`Server running at ${address}`);
});
