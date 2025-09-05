import { GameInfo } from "./frontendStructures.js";
import { ctx } from "./index.js";
import { restoreScreen } from "./screenDisplay.js";

export function logout(game:GameInfo)
{
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

		document.getElementById("userStatusInterface")?.remove();

		restoreScreen(game);
		// const logoutButton = document.getElementById ("logoutButton") as HTMLElement;
		// const loginButton = document.getElementById ("loginButton") as HTMLElement;
		// const registerButton = document.getElementById ("registerButton") as HTMLElement;
		// const playSelect = document.getElementById("playSelect");
		// const friendStuff = document.getElementById("friendStuff");
		// const messages = document.getElementById("messages");
		// if (logoutButton) logoutButton.classList.add("hidden");
		// if (loginButton) loginButton.classList.remove("hidden");
		// if (registerButton) registerButton.classList.remove("hidden");
		// if (playSelect) playSelect.classList.add("hidden");
		// if (friendStuff) friendStuff.classList.add("hidden");
		// if (messages) messages.classList.add("hidden");
		ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
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