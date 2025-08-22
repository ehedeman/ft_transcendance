import { GameInfo, pageIndex, PlayerLogin } from "./frontendStructures.js";
import { getFriendList, getFriendRequestList, getRejectedFriendRequests } from "./friendSystemFunctions.js";
import { createWebSocketConnection } from "./websocketConnection.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { SendMessageHandler, getChatHistoryFunction, addFriendFunction, friendRequestListFunction } from "./friendSystemActions.js";
import { restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";
import { navigate } from "./index.js";

export function showGeneralLoginModal(game: GameInfo) {
	const modal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const usernameInput = document.getElementById("loginUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
	usernameInput.value = "";
	passwordInput.value = "";
	usernameInput.className = "mb-2 px-2 py-1 border rounded block";
	modal.style.display = "flex";
}

function hideGeneralLoginModal() {
	const modal = document.getElementById("generalLoginModal") as HTMLDivElement;
	modal.style.display = "none";
}

function loginRequest(loginPlayer: PlayerLogin, game: GameInfo) {
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
		// hideGeneralLoginModal();
		game.currentlyLoggedIn.name = loginPlayer.username; // this is just for the note who is login now.
		emptyLoginFields("loginGeneral");

		// needs to get data from database (stats and whatnot)

		game.currentlyLoggedIn.name = loginPlayer.username;
		game.currentlyLoggedIn.gamesLost = 0;
		game.currentlyLoggedIn.gamesWon = 0;
		game.currentlyLoggedIn.playerscore = 0;
		// game.players.push({
		// 	name: loginPlayer.username,
		// 	gamesLost: 0,
		// 	gamesWon: 0,
		// 	playerscore: 0,
		// });
		createWebSocketConnection(loginPlayer.username);
		// get the friend list
		getFriendList(loginPlayer.username);
		getFriendRequestList(loginPlayer.username);
		const addFriend = document.getElementById("addFriend") as HTMLElement;
		if (addFriend) addFriend.style.display = "block";
		getRejectedFriendRequests(loginPlayer.username);
		// restoreScreenLoggedIn();
		navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
		return response.json();
	})
	.catch(error => {
		console.error("Error during Login:", error);
	});
}


export function callLoginEventListeners(game: GameInfo)
{
	document.getElementById("loginButton")?.addEventListener("click", () => {
		navigate(game.availablePages[pageIndex.LOGIN], "", game);
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
		loginRequest(loginPlayer, game);
	});

/** Create WebSocket connection */
	SendMessageHandler();
	getChatHistoryFunction(game);
	addFriendFunction(game);
	friendRequestListFunction(game);

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

	document.getElementById("CancelGeneralLogin")?.addEventListener("click", () => {
		hideGeneralLoginModal();
		restoreScreen();
		navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
	});

	document.getElementById("showLoginPassword")?.addEventListener("click", () => {
		const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
		if (passwordInput.type === "password") {
			passwordInput.type = "text";
		} else {
			passwordInput.type = "password";
		}
	});
}
