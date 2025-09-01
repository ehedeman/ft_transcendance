import { GameInfo, pageIndex, PlayerLogin, TournamentStage } from "./frontendStructures.js";
import { tournamentEnd, tournamentPlayGame } from "./tournament.js";
import { restoreScreen } from "./screenDisplay.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { handleKeydown, handleKeyup, navigate } from "./index.js";

function registerPlayer(i: number, game: GameInfo, players: PlayerLogin[]): Promise<PlayerLogin | null> {
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
				tournamentEnd(1, game);
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
						tournamentEnd(1, game);
						resolve(null);
						return;
					}
					if (checkDoubleLogin(players, loginPlayer)) {
						alert("Player alreayd logged in!");
					}
					else {
						alert("Login successful!");
						game.t.players.push({ name: username, score: 0 });
					}
					emptyLoginFields("loginTournament");
					game.t.players.push({ name: username, score: 0 });
					hidetournamentRegistrationModal();
					resolve(loginPlayer);
				})
		};
	});
}

function checkDoubleLogin(players: PlayerLogin[], newPlayer: PlayerLogin): boolean {
	for (let index = 0; index < players.length; index++) {
		if (newPlayer.username === players[index].username) {
			return true;
		}
	}
	return false;
}

export async function tournamentRegisterPlayers(game: GameInfo): Promise<void> {
	const players: PlayerLogin[] = [];
	for (let i = 1; i <= 4; i++) {
		console.log("current iteration: " + i);
		const player = await registerPlayer(i, game, players);
		if (player) {
			if (checkDoubleLogin(players, player)) {
				i = i - 1;
				continue;
			}
		}
		if (!player || !player.username || !player.password) break;
		console.log("Registered player:", player);
		players.push(player);
		game.players.push({ name: players[players.length - 1].username, gamesLost: 0, gamesWon: 0, playerscore: 0 });
	}
	//uncommment once database is ready
	if (game.players.length === 4) {
		game.t.stage = TournamentStage.Regular1;
		game.tournamentLoopActive = true;
		document.addEventListener("keydown", handleKeydown);
		document.addEventListener("keyup", handleKeyup);
		fetch("/startTournament")
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to start tournament");
			}
			return response.json();
		})
		.then(data => {
			console.log("Tournament started:", data);
			tournamentPlayGame(game);
		})
		.catch(error => {
			console.error("Error starting tournament:", error);
		});
	} else {
		game.players.splice(0, game.players.length);
		tournamentEnd(0, game);
		hidetournamentRegistrationModal();
		restoreScreenLoggedIn();
		fetch("/endLocalMode");
	}
}

function showtournamentRegistrationModal(playerNr: number): void {

	const modal = document.getElementById("tournamentRegistrationModal")!;
	const usernameInput = document.getElementById("tournamentUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("tournamentPassword") as HTMLInputElement;
	const header = document.getElementById("tournamentRegisterHeader") as HTMLHeadingElement;

	header.textContent = `Register Tournament Player ${playerNr}`;
	usernameInput.value = "";
	passwordInput.value = "";

	usernameInput.className = "mb-2 px-2 py-1 border rounded block";

	modal.style.display = "flex";
}


function hidetournamentRegistrationModal() {
	const modal = document.getElementById("tournamentRegistrationModal") as HTMLDivElement;
	modal.style.display = "none";
}

import { restoreScreenLoggedIn } from "./screenDisplay.js";
export function callTournamentEventListeners(game: GameInfo) {
	document.getElementById("tournamentFinishContinue")?.addEventListener("click", () => {
		game.t.finishScreenRunning = false;
		fetch("/endTournament")
			.then(response => {
				if (!response.ok) {
					throw new Error("Failed to end tournament");
				}
				return response.json();
			})
			.then(data => {
				console.log("Tournament ended:", data);
			})
			.catch(error => {
				console.error("Error ending tournament:", error);
			});
		tournamentEnd(0, game);
		restoreScreenLoggedIn();
	});

	document.getElementById("tournamentResetButton")?.addEventListener("click", () => {
		game.t.finishScreenRunning = false;
		tournamentEnd(0, game);
		restoreScreenLoggedIn();
	});

	document.getElementById("CancelGeneralTournament")?.addEventListener("click", () => {
		hidetournamentRegistrationModal();
		fetch("/cancelledGame");
		const resetButton = document.getElementById("tournamentResetButton") as HTMLElement;
		if (resetButton) resetButton.style.display = "none";
		tournamentEnd(1, game);
		// restoreScreen(game);
		navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
		const playSelect = document.getElementById("playSelect");
		if (playSelect) playSelect.style.display = "block";
		restoreScreenLoggedIn();
		fetch("/endLocalMode");

	});

	document.getElementById("showTournamentPassword")?.addEventListener("click", () => {
		const passwordInput = document.getElementById("tournamentPassword") as HTMLInputElement;
		if (passwordInput.type === "password") {
			passwordInput.type = "text";
		} else {
			passwordInput.type = "password";
		}
	});
}

