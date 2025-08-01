import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';

const app = fastify();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const window_width: number = 900;
const window_height: number = 600;

const pad_width: number = 10;
const pad_height: number = 200;

let ballX: number = window_width / 2;
let ballY: number = window_height / 2;
const ballRadius: number = 10;
let ballSpeedX: number = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
let ballSpeedY: number = (Math.random() * 2 - 1) * 3;

let pad_player1X: number = window_width - 100;
let pad_player1Y: number = window_height / 2 - pad_height / 2;

let pad_player2X: number = 100;
let pad_player2Y: number = window_height / 2 - pad_height / 2;

let player1_score = 0;
let player2_score = 0;

let ballPaused = true;

let gameFinished = false;

function touchingPaddle1(): boolean {
	return (
		ballX - ballRadius < pad_player1X + pad_width &&
		ballX + ballRadius > pad_player1X &&
		ballY + ballRadius > pad_player1Y &&
		ballY - ballRadius < pad_player1Y + pad_height
	);
}

function touchingPaddle2(): boolean {
	return (
		ballX - ballRadius < pad_player2X + pad_width &&
		ballX + ballRadius > pad_player2X &&
		ballY + ballRadius > pad_player2Y &&
		ballY - ballRadius < pad_player2Y + pad_height
	);
}

function resetBall(): void {
	ballX = window_width / 2;
	ballY = window_height / 2;
	ballPaused = true;
	ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
	ballSpeedY = (Math.random() * 2 - 1) * 3;
	pad_player1Y = window_height / 2 - pad_height / 2;
	pad_player2Y = window_height / 2 - pad_height / 2;
}

app.get('/pressspace', async (request, reply) => {
	ballPaused = !ballPaused;
	reply.send({ status: ballPaused ? 'Ball paused' : 'Ball unpaused' });
});

app.get('/pressArrowUp', async (request, reply) => {
	if (pad_player1Y > 0) {
		pad_player1Y -= 5; // Move paddle up
	}
	reply.send({ status: 'Paddle 1 moved up' });
});

app.get('/pressArrowDown', async (request, reply) => {
	if (pad_player1Y + pad_height < window_height) {
		pad_player1Y += 5; // Move paddle down
	}
	reply.send({ status: 'Paddle 1 moved down' });
});

app.get('/pressW', async (request, reply) => {
	if (pad_player2Y > 0) {
		pad_player2Y -= 5; // Move paddle up
	}
	reply.send({ status: 'Paddle 2 moved up' });
});

app.get('/pressS', async (request, reply) => {
	if (pad_player2Y + pad_height < window_height) {
		pad_player2Y += 5; // Move paddle down
	}
	reply.send({ status: 'Paddle 2 moved down' });
});

let accaleration = 0.1; // Speed increase factor

function calculateBallCoords(): void {
	if (ballPaused) return; // Skip updates if the ball is paused
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	// Bounce off top and bottom
	if (ballY - ballRadius < 0 || ballY + ballRadius > window_height) {
		ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1() && ballSpeedX > 0) {
		// ballSpeedX *= -1 - accaleration;
		if (ballSpeedX < 30) {
			ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			ballSpeedX *= -1; // Just reverse direction if already fast
		}
	} else if (touchingPaddle2() && ballSpeedX < 0) {
		// ballSpeedX *= -1 - accaleration;
		if (ballSpeedX > -30) {
			ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			ballSpeedX *= -1; // Just reverse direction if already fast
		}
	}

	// Check if ball passed player1 (left side)
	if (ballX - ballRadius < 0) {
		player1_score++;
		resetBall();
	}

	// Check if ball passed player2 (right side)
	if (ballX + ballRadius > window_width) {
		player2_score++;
		resetBall();
	}
}

function resetGame(): void {
	player1_score = 0;
	player2_score = 0;
	resetBall();
	gameFinished = false;
}

app.get('/resetgame', async (request, reply) => {
	resetGame();
	reply.type('application/json').send({
		ballX: ballX,
		ballY: ballY,
		player1_y: pad_player1Y,
		player2_y: pad_player2Y,
		player1_score: player1_score,
		player2_score: player2_score,
		gamefinished: gameFinished,
	});
});

function updateGame(): void {
	if (player1_score === 5) {
		gameFinished = true;
	}
	if (player2_score === 5) {
		gameFinished = true;
	}
	calculateBallCoords();
}

setInterval(() => {
	updateGame();
}, 1000 / 60);

app.get('/getstatus', async (request, reply) => {
	reply.type('application/json').send({
		ballX: ballX,
		ballY: ballY,
		player1_y: pad_player1Y,
		player2_y: pad_player2Y,
		player1_score: player1_score,
		player2_score: player2_score,
		gamefinished: gameFinished,
		ballSpeedX: ballSpeedX,
	});
});

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) throw err;
	console.log(`Server running at ${address}`);
});
