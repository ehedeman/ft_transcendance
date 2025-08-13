import { Player, canvasInfo, BallInfo, playerPaddle, GameInfo, TournamentStage, PlayerLogin, PlayerRegistration } from "./frontendStructures.js";
import { tournamentEnd, tournamentLogic, tournamentPlayGame } from "./tournament.js";
// import e{ rounds } from "./server.js";
import { tournamentFinished, showWinnerScreen } from "./tournament.js";

let rounds = 1;

let game = new GameInfo();

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 900;
canvas.height = 600;
canvas.style.background = "black";


let canvas_focus: boolean = false;
canvas.addEventListener("click", () => canvas_focus = true);

document.addEventListener("click", (e: MouseEvent) => {
	if (e.target !== canvas) canvas_focus = false;
});

const keysPressed: { [key: string]: boolean } = {};

export function handleKeydown(e: KeyboardEvent): void {
	if (e.key === " " && !canvas_focus) {
		fetch("/pressspace");
	}

	const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
	if (scrollKeys.indexOf(e.key) !== -1) {
		e.preventDefault();
	}

	keysPressed[e.key] = true;
}

export function handleKeyup(e: KeyboardEvent): void {
	keysPressed[e.key] = false;
}

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

let gamefinished = false;
/*--------------------------two players game register----------------------------*/




/*--------------------------registration modal declaration--------------------------*/





function showGeneralRegistrationModal(game: GameInfo) {
	const modal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const usernameInput = document.getElementById("registerUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("registerPassword") as HTMLInputElement;
	const countryInput = document.getElementById("registerCountry") as HTMLInputElement;
	const nameInput = document.getElementById("registerName") as HTMLInputElement;
	nameInput.value = "";
	usernameInput.value = "";
	passwordInput.value = "";
	countryInput.value = "";
	usernameInput.type = "text";
	usernameInput.className = "mb-2 px-2 py-1 border rounded block";
	nameInput.type = "text";
	nameInput.className = "mb-2 px-2 py-1 border rounded block";
	countryInput.type = "text";
	countryInput.className = "mb-2 px-2 py-1 border rounded block";
	passwordInput.type = "password";
	usernameInput.placeholder = "Username";
	passwordInput.placeholder = "Password";
	countryInput.placeholder = "Country";
	nameInput.placeholder = "Name";
	usernameInput.required = true;
	passwordInput.required = true;
	nameInput.required = true;
	countryInput.required = true;
	modal.style.display = "block";
}

function hideGeneralRegistrationModal() {
	const modal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	modal.style.display = "none";
}

document.getElementById("alice")?.addEventListener("click", () => {// this is just a test
	console.log("Alice clicked");

	const friendList2 = document.getElementById("friendList2");
	if (friendList2) {
		// Clear existing content
		friendList2.innerHTML = "";
		// Add Alice's details
		const aliceDetails = [
			"Status: Online",
			"Games Won: 15",
			"Games Lost: 3",
			"Rank: Pro",
			"Last Game: 2 hours ago"
		];

		aliceDetails.forEach(detail => {
			const li = document.createElement("li");
			li.textContent = detail;
			li.id = detail;
			li.style.cssText = "cursor: pointer;";
			friendList2.appendChild(li);
		});

		// Show the list
		// friendList2.style.display = "block";
	}
});

document.getElementById("friendList2")?.addEventListener("click", (e) => {// this is also just a test
	const target = e.target as HTMLElement;
	if (target.tagName === "LI") {
		console.log(`${target.textContent} clicked`);

		// Handle specific items
		if (target.id === "Rank: Pro") {
			console.log("I love this rank!");
			// Handle rank logic here
		}
	}
});

document.getElementById("registerButton")?.addEventListener("click", () => {
	const registerButton = document.getElementById("registerButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (tournamentButton) tournamentButton.style.display = "none";
	if (loginButton) loginButton.style.display = "none";
	showGeneralRegistrationModal(game);
});

document.getElementById("generalRegistrationForm")?.addEventListener("submit", (e) => {
	e.preventDefault();
	const nameInput = document.getElementById("registerName") as HTMLInputElement;
	const usernameInput = document.getElementById("registerUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("registerPassword") as HTMLInputElement;
	const countryInput = document.getElementById("registerCountry") as HTMLInputElement;
	const name = nameInput.value.trim();
	const username = usernameInput.value.trim();
	const password = passwordInput.value.trim();
	const country = countryInput.value.trim();
	if (!username || !password || !name || !country) {
		alert("Name, username, password and country cannot be empty!");
		return;
	}

	const newPlayer: PlayerRegistration = {
		name,
		username,
		password,
		country,
	};
	fetch("/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(newPlayer)
	})
		.then(response => {
			if (!response.ok) {
				alert("Registration failed. Please try again.");
				return;
			}
			console.log("Registration successful:", response);
			alert("Registration successful! You can now log in.");
			hideGeneralRegistrationModal();
			location.reload();// This will reload the page after registration
			return response.json();
		})
		.catch(error => {
			console.error("Error during Registration:", error);
		});
});


document.getElementById("generalCancelRegistration")?.addEventListener("click", () => {
	hideGeneralRegistrationModal();
	location.reload();
});


/*-----------------------------login modal declaration------------------------------*/



function showGeneralLoginModal(game: GameInfo) {
	const modal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const usernameInput = document.getElementById("loginUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
	usernameInput.value = "";
	passwordInput.value = "";
	usernameInput.type = "text";
	usernameInput.className = "mb-2 px-2 py-1 border rounded block";
	passwordInput.type = "password";
	usernameInput.placeholder = "Username";
	passwordInput.placeholder = "Password";
	usernameInput.required = true;
	passwordInput.required = true;
	modal.style.display = "block";
}

function hideGeneralLoginModal() {
	const modal = document.getElementById("generalLoginModal") as HTMLDivElement;
	modal.style.display = "none";
}

document.getElementById("loginButton")?.addEventListener("click", () => {
	const registerButton = document.getElementById("registerButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (tournamentButton) tournamentButton.style.display = "none";
	if (loginButton) loginButton.style.display = "none";

	showGeneralLoginModal(game);
});

document.getElementById("generalLoginForm")?.addEventListener("submit", (e) => {
	e.preventDefault();
	const usernameInput = document.getElementById("loginUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
	const username = usernameInput.value.trim();
	const password = passwordInput.value.trim();
	if (!username || !password) {
		alert("Username and password cannot be empty!");
		return;
	}
	var loginPlayer: PlayerLogin = {
		username: username,
		password: password,
	};
	fetch("/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(loginPlayer)
	})
		.then(response => {
			if (!response.ok) {
				const message: string = response.status === 401 ? 'Username or password is incorrect' : 'Login failed. Please try again.';
				alert(message);
				return;
			}
			alert("Login successful!");
			hideGeneralLoginModal();
			game.username = loginPlayer.username; // this is just for the note who is login now.
			game.players.push({
				name: loginPlayer.username,
				gamesLost: 0,
				gamesWon: 0,
				playerscore: 0,
			}
			);
			game.websocket = new WebSocket(`ws://localhost:3000/ws?username=${loginPlayer.username}`);

			game.websocket.onopen = () => {
				console.log("✅ WebSocket connection established successfully!");
				// Send test message AFTER connection is established
			};

			game.websocket.onmessage = (event) => {
				console.log("📥 Received from server:", event.data);
				handleWebSocketMessage(event);
			};

			game.websocket.onclose = () => {
				console.log("WebSocket connection closed.");
			};

			game.websocket.onerror = (error) => {
				console.error("❌ WebSocket error:", error);
			};
			return response.json(); // Optional: if you need response data
		})
		.catch(error => {
			console.error("Error during Login:", error);
		});
});

document.getElementById("testmessage")?.addEventListener("click", () => {
	if (game.websocket) {
		if (game.username === "a") {
			game.websocket.send(JSON.stringify({
				type: "privateMessage",
				target: "b",
				from: game.username,
				message: "Do you receive this message, b?"
			}));
		}
		if (game.username === "b") {
			game.websocket.send(JSON.stringify({
				type: "privateMessage",
				target: "a",
				from: game.username,
				message: "Do you receive this message, a?"
			}));
		}
	}
});

// ------------------------------------------------add friend-------------------------------------
document.getElementById("addFriend")?.addEventListener("click", () => {
	const friendName = prompt("Enter the name of the friend to add:");
	if (friendName) {
		fetch(`/addFriend?nameToAdd=${encodeURIComponent(friendName)}&accountName=${encodeURIComponent(game.username)}`)
			.then(response => {
				if (response.ok) {
					alert("Friend added successfully!");
					const friendList = document.getElementById("friendList");
					if (friendList) {
						const newFriendItem = document.createElement("li");
						newFriendItem.id = friendName;
						newFriendItem.textContent = friendName;
						friendList.appendChild(newFriendItem);
					}
				} else {
					alert("Failed to add friend.");
				}
			})
	} else {
		alert("Friend name cannot be empty!");
	}
});

function handleFriendRequest(data: any) {
	console.log(`------------------------------DO WE REACH HERE?---------------------`);
	const friendName = data.from;
	const result = confirm(`Do you want to accept the friend request from ${friendName}?`);
	if (result) {
		game.websocket?.send(JSON.stringify({ reply: "accept" }));
	} else {
		game.websocket?.send(JSON.stringify({ reply: "decline" }));
	}
}

function handleWebSocketMessage(event: MessageEvent) {
	const data = JSON.parse(event.data);
	switch (data.type) {
		case "friendRequest":
			handleFriendRequest(data);
			break;
		// Handle other message types...
	}
};

document.getElementById("CancelGeneralLogin")?.addEventListener("click", () => {
	hideGeneralLoginModal();
	location.reload();
});

document.getElementById("showLoginPassword")?.addEventListener("click", () => {
	const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
	if (passwordInput.type === "password") {
		passwordInput.type = "text";
	} else {
		passwordInput.type = "password";
	}
});




/*--------------------------tournament modal declaration----------------------------*/


function registerPlayer(i: number, game: GameInfo): Promise<PlayerLogin> {
	return new Promise((resolve) => {
		const tournamentForm = document.getElementById("tournamentRegistrationForm") as HTMLFormElement;
		showtournamentRegistrationModal(i);
		tournamentForm.onsubmit = (e: Event) => {
			e.preventDefault();
			const usernameInput = document.getElementById("tournamentUsername") as HTMLInputElement;
			const passwordInput = document.getElementById("tournamentPassword") as HTMLInputElement;
			const username = usernameInput.value.trim();
			const password = passwordInput.value.trim();

			if (!username || !password) {
				alert("Username and password cannot be empty!");
				return;
			}

			const loginPlayer: PlayerLogin = { username, password };

			fetch("/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(loginPlayer),
			})
				.then((response) => {
					if (!response.ok) {
						alert("Login failed. Please try again.");
						return;
					}
					alert("Login successful!");
					// return response.json();
				})
				.then((data) => {
					console.log("Login successful:", data);
				})
				.catch(error => {
					console.error("Error during Login:", error);
				});
			game.t.players.push({ name: username, score: 0 });
			hidetournamentRegistrationModal();
			resolve(loginPlayer);
		};
	});
}


async function tournamentRegisterPlayers(game: GameInfo): Promise<void> {
	const players: PlayerLogin[] = [];
	for (let i = 1; i <= 4; i++) {
		const player = await registerPlayer(i, game);
		fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(player),
		})
			.then((response) => {
				if (!response.ok) {
					tournamentEnd(0, game);
					location.reload();
					return;
				}
			})
		players.push(player);
		game.players.push({ name: players[players.length - 1].username, gamesLost: 0, gamesWon: 0, playerscore: 0 });
	}
	//uncommment once database is ready
	game.t.stage = TournamentStage.Regular1;
	game.tournamentLoopActive = true;
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("keyup", handleKeyup);
	tournamentPlayGame(game);
}

function showtournamentRegistrationModal(playerNr: number): void {

	const modal = document.getElementById("tournamentRegistrationModal")!;
	const usernameInput = document.getElementById("tournamentUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("tournamentPassword") as HTMLInputElement;
	const header = document.getElementById("tournamentRegisterHeader") as HTMLHeadingElement;

	header.textContent = `Register Tournament Player ${playerNr}`;
	usernameInput.value = "";
	passwordInput.value = "";
	usernameInput.type = "text";
	usernameInput.className = "mb-2 px-2 py-1 border rounded block";
	passwordInput.type = "password";
	usernameInput.placeholder = "Username";
	passwordInput.placeholder = "Password";
	usernameInput.required = true;
	passwordInput.required = true;

	modal.style.display = "block";
}


function hidetournamentRegistrationModal() {
	const modal = document.getElementById("tournamentRegistrationModal") as HTMLDivElement;
	modal.style.display = "none";
}

document.getElementById("tournamentFinishContinue")?.addEventListener("click", () => {
	//game.t.finishScreenRunning = false;
	tournamentEnd(0, game);
	location.reload();
});

document.getElementById("tournamentResetButton")?.addEventListener("click", () => {
	// tournamentEnd(0, game);
	location.reload();
});

document.getElementById("WinnerScreenContinue")?.addEventListener("click", () => {
	fetch("/gameContinue");
	if (game.tournamentLoopActive && game.t.stage === TournamentStage.Complete)
		tournamentFinished(game);
	const winnerScreen = document.getElementById("WinnerScreen");
	if (winnerScreen) winnerScreen.style.display = "none";
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("keyup", handleKeyup);
	getGameStatus();
});


document.getElementById("playSelect")?.addEventListener("change", (event: Event) => {
	const playSelect = document.getElementById("playSelect") as HTMLSelectElement;
	const target = event.target as HTMLSelectElement;
	const selectedOption = target.value;
	if (playSelect)
		playSelect.selectedIndex = 0;
	if (selectedOption) {
		switch (selectedOption) {
			// case "play":
			// 	break ;
			case "tournament":
				document.removeEventListener('keydown', handleKeydown);
				document.removeEventListener('keyup', handleKeyup);
				const registerButton = document.getElementById("registerButton");
				const select = document.getElementById("playSelect");
				const loginButton = document.getElementById("loginButton");

				if (registerButton) registerButton.style.display = "none";
				if (select) select.style.display = "none";
				if (loginButton) loginButton.style.display = "none";

				const resetButton = document.getElementById("tournamentResetButton");
				if (resetButton) resetButton.style.display = "block";
				tournamentRegisterPlayers(game);
				break;
			case "multiplayer":

				break
			case "1v1":

				break
			default:
				break;
		}
	}
});

document.getElementById("tournamentButton")?.addEventListener("click", () => {
	document.removeEventListener('keydown', handleKeydown);
	document.removeEventListener('keyup', handleKeyup);
	const registerButton = document.getElementById("registerButton");
	const tournamentButton = document.getElementById("tournamentButton");
	const loginButton = document.getElementById("loginButton");

	if (registerButton) registerButton.style.display = "none";
	if (tournamentButton) tournamentButton.style.display = "none";
	if (loginButton) loginButton.style.display = "none";

	const resetButton = document.getElementById("tournamentResetButton");
	if (resetButton) resetButton.style.display = "block";

	tournamentRegisterPlayers(game);
});


document.getElementById("CancelGeneralTournament")?.addEventListener("click", () => {
	hidetournamentRegistrationModal();
	tournamentEnd(1, game);
	location.reload();	//restores the regular interface
});

document.getElementById("showTournamentPassword")?.addEventListener("click", () => {
	const passwordInput = document.getElementById("tournamentPassword") as HTMLInputElement;
	if (passwordInput.type === "password") {
		passwordInput.type = "text";
	} else {
		passwordInput.type = "password";
	}
});

/*--------------------------game logic----------------------------*/
function drawMiddlePath(): void {
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	for (let y = 0; y < game.canvas.height; y += 20) {
		ctx.beginPath();
		ctx.moveTo(game.canvas.width / 2, y);
		ctx.lineTo(game.canvas.width / 2, y + 10);
		ctx.stroke();
	}
}

function drawCircle(x: number, y: number, radius: number): void {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function calculatePaddleCoords(): void {
	if (keysPressed["ArrowUp"]) {
		fetch("/pressArrowUp");
	}
	if (keysPressed["ArrowDown"]) {
		fetch("/pressArrowDown");
	}
	if (keysPressed["w"]) {
		fetch("/pressW");
	}
	if (keysPressed["s"]) {
		fetch("/pressS");
	}
}

function getGameStatus(): void {
	if (!gamefinished) {
		var length = game.t.matches.length;
		fetch("/getstatus")
			.then(response => response.json())
			.then(data => {
				game.ball.ballX = data.ballX;
				game.ball.ballY = data.ballY;
				game.player1Paddle.y = data.player1_y;
				game.player2Paddle.y = data.player2_y;
				if (game.tournamentLoopActive && length) {
					game.t.matches[length - 1].player1.score = data.player1_score;
					game.t.matches[length - 1].player2.score = data.player2_score;
				}
				else {
					game.players[0].playerscore = data.player1_score;
					game.players[1].playerscore = data.player2_score;
				}
				game.ball.ballSpeedX = data.ballSpeedX;// Update ball speed
				if (data.gamefinished) {
					fetch("/resetgame")
						.then(response => response.json())
						.then(data => {
							game.ball.ballX = data.ballX;
							game.ball.ballY = data.ballY;
							game.player1Paddle.y = data.player1_y;
							game.player2Paddle.y = data.player2_y;
							if (game.tournamentLoopActive) {
								game.t.matches[length - 1].player1.score = data.player1_score;
								game.t.matches[length - 1].player2.score = data.player2_score;
							}
							else {
								game.players[0].playerscore = data.player1_score;
								game.players[1].playerscore = data.player2_score;
							}
						});
				}
			});
	}
}

function singlePlayerGame(): void {
	if (game.players[0].playerscore === rounds) {
		game.players[0].gamesWon++;
		game.players[1].gamesLost++;
		showWinnerScreen(game, game.players[0].name);
	}
	if (game.players[1].playerscore === rounds) {
		game.players[1].gamesWon++;
		game.players[0].gamesLost++;
		showWinnerScreen(game, game.players[1].name);
	}
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.players[0].name + ": " + game.players[0].playerscore, 10, 25);
	ctx.fillText(game.players[1].name + ": " + game.players[1].playerscore, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoords();
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);
	getGameStatus();
}

function tournamentGame(): number {
	getGameStatus();
	if (tournamentLogic(game) === 1)
		return (0);
	var length = game.t.matches.length;
	if (game.t.stage === TournamentStage.Complete)
		return 1;
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
	ctx.font = "20px Arial"; ctx.fillStyle = "white";
	ctx.fillText(game.t.matches[length - 1].player1.name + ": " + game.t.matches[length - 1].player1.score, 10, 25);
	ctx.fillText(game.t.matches[length - 1].player2.name + ": " + game.t.matches[length - 1].player2.score, 10, 50);
	ctx.fillText("ballSpeedX: " + (game.ball.ballSpeedX ? Math.abs(game.ball.ballSpeedX).toFixed(2) : 0), 10, 75); // Display ball speed
	calculatePaddleCoords();
	drawMiddlePath();
	drawCircle(game.ball.ballX, game.ball.ballY, game.ball.ballRadius);
	ctx.fillStyle = "white";
	ctx.fillRect(game.player1Paddle.x, game.player1Paddle.y, game.player1Paddle.width, game.player1Paddle.height);
	ctx.fillRect(game.player2Paddle.x, game.player2Paddle.y, game.player2Paddle.width, game.player2Paddle.height);

	return 0;
}

function updateGame(): void {
	if (!game.t.finishScreenRunning && game.t.stage !== TournamentStage.Registration) {
		if (game.players.length >= 2 && !game.tournamentLoopActive) {
			singlePlayerGame();
		}
		else if (game.tournamentLoopActive) {
			tournamentGame();
		}
	}
	requestAnimationFrame(updateGame);
}
updateGame();
