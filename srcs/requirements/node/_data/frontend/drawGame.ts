import { game, rounds, ctx, keysPressed } from "./index.js"
import { showWinnerScreen } from "./tournament.js";

// Create gradient background for the game
function drawGameBackground(): void {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, game.canvas.height);
    gradient.addColorStop(0, 'rgba(23, 32, 42, 0.8)');
    gradient.addColorStop(1, 'rgba(44, 62, 80, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    
    // Draw game border with glow effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, game.canvas.width - 6, game.canvas.height - 6);
    
    // Draw subtle grid pattern in background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = gridSize; x < game.canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, game.canvas.height);
        ctx.stroke();
    }
    
    for (let y = gridSize; y < game.canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(game.canvas.width, y);
        ctx.stroke();
    }
}

function drawMiddlePathRemote1v1(): void {
    // Draw center line with glow effect
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(100, 200, 255, 0.8)";
    ctx.shadowBlur = 8;
    
    for (let y = 0; y < game.canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(game.canvas.width / 2, y);
        ctx.lineTo(game.canvas.width / 2, y + 10);
        ctx.stroke();
    }
    ctx.restore();
}

function drawCircleRemote1v1(x: number, y: number, radius: number): void {
    // Draw ball with glow effect
    ctx.save();
    
    // Ball glow
    const ballGlowRadius = radius * 1.5;
    const ballGlow = ctx.createRadialGradient(x, y, 0, x, y, ballGlowRadius);
    ballGlow.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    ballGlow.addColorStop(0.3, "rgba(255, 255, 255, 0.3)");
    ballGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    ctx.beginPath();
    ctx.arc(x, y, ballGlowRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballGlow;
    ctx.fill();
    
    // Main ball
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    const ballGradient = ctx.createRadialGradient(
        x - radius/3, y - radius/3, radius/10, 
        x, y, radius
    );
    ballGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    ballGradient.addColorStop(1, "rgba(220, 220, 255, 0.8)");
    
    ctx.fillStyle = ballGradient;
    ctx.fill();
    ctx.closePath();
    
    ctx.restore();
}

function calculatePaddleCoordsRemote1v1(): void {
	if (game.remoteMode && !game.multiplayerMode) {
		if (keysPressed["space"]) {
			fetch(`/pressSpaceRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["ArrowUp"]) {
			fetch(`/pressArrowUpRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["ArrowDown"]) {
			fetch(`/pressArrowDownRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["w"]) {
			fetch(`/pressWRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
		if (keysPressed["s"]) {
			fetch(`/pressSRemote1v1?sender=${game.currentlyLoggedIn.name}`);
		}
	}
}

function drawScoreBoard() {
    // Draw a semi-transparent score panel at the top
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, game.canvas.width, 40);
    
    // Draw player scores with custom font and shadows
    const playerColors = ["#4facfe", "#00f2fe"];
    const secondPlayerColors = ["#0061ff", "#60efff"];
    
    // Player 1 score
    ctx.save();
    ctx.font = "bold 22px Montserrat";
    ctx.shadowColor = playerColors[0];
    ctx.shadowBlur = 4;
    ctx.fillStyle = playerColors[0];
    ctx.textAlign = "left";
    ctx.fillText(`${game.players[0].name}: ${game.players[0].playerscore}`, 20, 28);
    ctx.restore();
    
    // Player 2 score
    ctx.save();
    ctx.font = "bold 22px Montserrat";
    ctx.shadowColor = secondPlayerColors[0];
    ctx.shadowBlur = 4;
    ctx.fillStyle = secondPlayerColors[0];
    ctx.textAlign = "right";
    ctx.fillText(`${game.players[1].name}: ${game.players[1].playerscore}`, game.canvas.width - 20, 28);
    ctx.restore();
    
    // Ball speed indicator
    ctx.save();
    ctx.font = "16px Montserrat";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.textAlign = "center";
    ctx.fillText(
        `Speed: ${(game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(1) : 0)}x`,
        game.canvas.width / 2,
        28
    );
    ctx.restore();
}

function drawPaddle(x: number, y: number, width: number, height: number, colorGradient: string[]): void {
    ctx.save();
    
    // Paddle glow
    ctx.shadowColor = colorGradient[0];
    ctx.shadowBlur = 15;
    
    // Create paddle gradient
    const paddleGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    paddleGradient.addColorStop(0, colorGradient[0]);
    paddleGradient.addColorStop(1, colorGradient[1]);
    
    // Draw paddle with rounded corners
    const radius = 5;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    ctx.fillStyle = paddleGradient;
    ctx.fill();
    
    ctx.restore();
}

export function drawGame() {
    // Check win conditions
	if (game.players[0].playerscore === rounds) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
		showWinnerScreen(game, game.players[0].name);
		game.remoteMode = false;
	}
	if (game.players[1].playerscore === rounds) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
		showWinnerScreen(game, game.players[1].name);
		game.remoteMode = false;
	}
	
	// Clear the canvas
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	
	// Draw game elements
	drawGameBackground();
	calculatePaddleCoordsRemote1v1();
	drawMiddlePathRemote1v1();
	drawCircleRemote1v1(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	
	// Draw paddles with gradients
	const paddles = [game.player1Paddle, game.player2Paddle];
	const paddleColors = [
	    ["#4facfe", "#00f2fe"], // Player 1 colors (blue)
	    ["#0061ff", "#60efff"]  // Player 2 colors (cyan)
	];
	
	for (let i = 0; i < paddles.length; i++) {
		drawPaddle(
			paddles[i].x,
			paddles[i].y,
			paddles[i].width,
			paddles[i].height,
			paddleColors[i]
		);
	}
	
	// Draw scoreboard overlay
	drawScoreBoard();
}
