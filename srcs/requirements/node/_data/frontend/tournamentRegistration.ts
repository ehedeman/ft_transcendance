import { GameInfo, PlayerLogin, TournamentStage } from "./frontendStructures.js";
import { tournamentEnd, tournamentPlayGame } from "./tournament.js";
import { restoreScreen } from "./screenDisplay.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { handleKeydown, handleKeyup } from "./index.js";

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
				})
				.then((data) => {
					console.log("Login successful:", data);
				})
				.catch(error => {
					console.error("Error during Login:", error);
				});
			emptyLoginFields("loginTournament");
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
					restoreScreen();
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

	usernameInput.className = "mb-2 px-2 py-1 border rounded block";

	modal.style.display = "flex";
}


function hidetournamentRegistrationModal() {
	const modal = document.getElementById("tournamentRegistrationModal") as HTMLDivElement;
	modal.style.display = "none";
}


export function callTournamentEventListeners(game:GameInfo)
{
	document.getElementById("tournamentFinishContinue")?.addEventListener("click", () => {
		//game.t.finishScreenRunning = false;
		tournamentEnd(0, game);
		restoreScreen();
		 
	});

	document.getElementById("tournamentResetButton")?.addEventListener("click", () => {
		tournamentEnd(0, game);
		restoreScreen();
		 
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
					const settingsButton = document.getElementById("settingsButton") as HTMLSelectElement;
					const settings = document.getElementById("settings") as HTMLSelectElement;

					if (settingsButton) settingsButton.style.display = "none";
					if (settings) settings.style.display = "none";
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

	document.getElementById("CancelGeneralTournament")?.addEventListener("click", () => {
		hidetournamentRegistrationModal();
		const resetButton = document.getElementById("tournamentResetButton") as HTMLElement;
		if (resetButton) resetButton.style.display = "none";
		tournamentEnd(1, game);
		restoreScreen();
		 
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

