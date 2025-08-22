import { navigate } from "./index.js";
import { GameInfo, pageIndex, Player, PlayerLogin } from "./frontendStructures.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { hideDefaultButtons, restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";

export function twoPlayerMatchStart(game: GameInfo) {
	hideDefaultButtons();
	const twoPlayerMatch = document.getElementById("twoPlayerMatchContainer") as HTMLDivElement;
	if (twoPlayerMatch) twoPlayerMatch.style.display = "block";
}

function showTwoPlayerMatchSelect() {
	const select = document.getElementById("twoPlayerMatchSelect");
	if (select) select.style.display = "block";
}

function hideTwoPlayerMatchSelect() {
	const select = document.getElementById("twoPlayerMatchSelect");
	if (select) select.style.display = "none";
}

function showGuestPlayerButtons() {
	const guestButton = document.getElementById("twoPlayerMatchGuestGame") as HTMLButtonElement;
	const playerButton = document.getElementById("twoPlayerMatchPlayerGame") as HTMLButtonElement;
	if (guestButton) guestButton.style.display = "block";
	if (playerButton) playerButton.style.display = "block";
}

function hideGuestPlayerButtons() {
	const guestButton = document.getElementById("twoPlayerMatchGuestGame") as HTMLButtonElement;
	const playerButton = document.getElementById("twoPlayerMatchPlayerGame") as HTMLButtonElement;
	const header = document.getElementById("twoPlayerMatchHeader");
	if (header) header.style.display = "none"
	if (guestButton) guestButton.style.display = "none";
	if (playerButton) playerButton.style.display = "none";
}

function hideLogin() {
	const login = document.getElementById("twoPlayerMatchLogin") as HTMLButtonElement;
	if (login) login.style.display = "none";
}

function showLogin() {
	const login = document.getElementById("twoPlayerMatchLogin") as HTMLButtonElement;
	if (login) login.style.display = "block";
}

function localMatch(game: GameInfo): void {
	hideTwoPlayerMatchSelect();
	showGuestPlayerButtons();
}

function remoteMatch(game: GameInfo): void {

}

export function restoreMatchState() {
	hideLogin();
	hideGuestPlayerButtons();
	showTwoPlayerMatchSelect();
	const header = document.getElementById("twoPlayerMatchHeader");
	if (header) header.style.display = "block"
	const container = document.getElementById("twoPlayerMatchContainer") as HTMLButtonElement;
	if (container) container.style.display = "none";
}

async function loginTotwoPlayerMatch(game: GameInfo): Promise<boolean> {
	const usernameInput = document.getElementById("twoPlayerMatchUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("twoPlayerMatchPassword") as HTMLInputElement;
	const username = usernameInput.value.trim();
	const password = passwordInput.value.trim();

	if (!username || !password) {
		alert("Username and password cannot be empty!");
		return false;
	}

	const loginPlayer: PlayerLogin = { username, password };

	try {
		const response = await fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(loginPlayer)
		});

		if (!response.ok) {
			const message = response.status === 401
				? 'Username or password is incorrect'
				: 'Login failed. Please try again.';
			alert(message);
			emptyLoginFields("twoPlayerMatch");
			return false;
		}
		else if (loginPlayer.username === game.currentlyLoggedIn.name) {
			const message = "Playing against yourself is forbidden.";
			alert(message);
			emptyLoginFields("twoPlayerMatch");
			return false;
		}
		emptyLoginFields("twoPlayerMatch");

		game.players.push(game.currentlyLoggedIn);

		// need to get Player info from database here/ just temporary like this
		const newPlayer: Player = ({
			name: loginPlayer.username,
			gamesWon: 0,
			gamesLost: 0,
			playerscore: 0
		});
		game.players.push(newPlayer);
		// needs to be added to game here cause its the second player playing

		return true;
	} catch (error) {
		console.error("Error during Login:", error);
		emptyLoginFields("twoPlayerMatch");
		return false;
	}
}

export function callTwoPlayerMatchEventListeners(game: GameInfo) {
	document.getElementById("twoPlayerMatchSelect")?.addEventListener("change", (event: Event) => {
		const twoPlayerMatchSelect = document.getElementById("twoPlayerMatchSelect") as HTMLSelectElement;
		const target = event.target as HTMLSelectElement;
		const selectedOption = target.value;
		if (twoPlayerMatchSelect)
			twoPlayerMatchSelect.selectedIndex = 0;
		if (selectedOption) {
			switch (selectedOption) {
				case "local":
					// navigate(game.availablePages[pageIndex.MATCH]);
					localMatch(game);
					break;
				case "remote":
					// navigate(game.availablePages[pageIndex.REMOTE_MATCH]);
					remoteMatch(game);
					break
				default:
					break;
			}
		}
	});
	document.getElementById("twoPlayerMatchGuestGame")?.addEventListener("click", (event: Event) => {
		hideGuestPlayerButtons();
	});
	document.getElementById("twoPlayerMatchPlayerGame")?.addEventListener("click", (event: Event) => {
		hideGuestPlayerButtons();
		showLogin();
	});
	document.getElementById("twoPlayerMatchLogin")?.addEventListener("submit", async (e) => {
		e.preventDefault();

		const success = await loginTotwoPlayerMatch(game);

		if (success) {
			restoreMatchState();
			const container = document.getElementById("twoPlayerMatchContainer") as HTMLButtonElement;
			if (container) container.style.display = "none";
			// navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
		} else {
			restoreMatchState();
			navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
			emptyLoginFields("twoPlayerMatch");
			// restoreScreen(game);
		}
	});
	document.getElementById("twoPlayerMatchCancel")?.addEventListener("click", (event: Event) => {
		restoreMatchState();
		restoreScreenLoggedIn();
	});
}