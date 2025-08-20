import { GameInfo } from "./frontendStructures";

function logout(game:GameInfo)
{
	console.log("current player:" + game.currentlyLoggedIn.name);
	fetch("/logout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username: game.currentlyLoggedIn.name })
	})
	.then(response => {
		if (!response.ok) {
			const message: string = response.status === 401 ? 'Username or password is incorrect' : 'Logout failed. Please try again.';
			alert(message);
			return;
		}
		alert("Logout successful!");

		game.currentlyLoggedIn.name = "default";
		game.currentlyLoggedIn.gamesLost = 0;
		game.currentlyLoggedIn.gamesWon = 0;
		game.currentlyLoggedIn.playerscore = 0;
	
		const logoutButton = document.getElementById ("logoutButton") as HTMLElement;
		const loginButton = document.getElementById ("loginButton") as HTMLElement;
		const registerButton = document.getElementById ("registerButton") as HTMLElement;
		const playSelect = document.getElementById("playSelect");
		if (logoutButton) logoutButton.style.display = "none";
		if (loginButton) loginButton.style.display = "block";
		if (registerButton) registerButton.style.display = "block";
		if (playSelect) playSelect.style.display = "none";
		return response.json();
	})
	.catch(error => {
		console.error("Error during Logout:", error);
	});
}

export function callLogoutEventListeners(game: GameInfo)
{
	document.getElementById("logoutButton")?.addEventListener("click", () => {	
		logout(game);
	});
}