import { GameInfo, pageIndex, PlayerLogin } from "./frontendStructures.js";
import { getFriendList, getFriendRequestList, getRejectedFriendRequests } from "./friendSystemFunctions.js";
import { createWebSocketConnection } from "./websocketConnection.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { SendMessageHandler, getChatHistoryFunction, addFriendFunction, friendRequestListFunction, showFriendStatus } from "./friendSystemActions.js";
import { restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";
import { navigate } from "./index.js";

export function showGeneralLoginModal(game: GameInfo) {
	const modal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const usernameInput = document.getElementById("loginUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("loginPassword") as HTMLInputElement;
	usernameInput.value = "";
	passwordInput.value = "";
	usernameInput.className = "mb-2 px-2 py-1 border rounded block";
	modal.classList.remove("hidden");
}

export function hideGeneralLoginModal() {
	const modal = document.getElementById("generalLoginModal") as HTMLDivElement;
	modal.classList.add("hidden");
}

export function getUserInfoAndCreateUserInterface(username: string) {
	fetch(`userStatus?username=${username}`)
		.then(response => {
			if (!response.ok) {
				console.error("Error fetching user status:", response);
				return;
			}
			return response.json();
		})
		.then(userInfo => {
			if (!userInfo) return;

			// Create user interface elements
			const userStatusInterFace = document.createElement("ul");
			userStatusInterFace.id = "userStatusInterface";
			userStatusInterFace.className = "absolute left-0 top-0 bg-gray-500/80 w-[200px] h-auto border border-black rounded-oval px-5 py-2.5";
			document.body.appendChild(userStatusInterFace);document.body.appendChild(userStatusInterFace);
			userStatusInterFace.innerHTML = `
				<li><strong>Username:</strong> ${username}</li>
				<li><img src="${userInfo.avatarUrl}" alt="${username}'s avatar" class="w-20 h-20 rounded-full mb-2.5" /></li>
				${Object.entries(userInfo).filter(([key]) => key !== "avatarUrl").map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join("")}
			`;
		})
		.catch(error => {
			console.error("Error fetching user status:", error);
		});
}

function renderMatchHistory(matchHistory: any[]) {
	const matchHistoryList = document.getElementById("matchHistoryList");
	if (matchHistoryList) {
		matchHistoryList.innerHTML = "";
		if (matchHistory.length === 0) {
			const listItem = document.createElement("li");
			listItem.textContent = "No match history found.";
			listItem.className = "p-3 text-center text-white/70";
			matchHistoryList.appendChild(listItem);
		}
		matchHistory.forEach((match: any) => {
			const listItem = document.createElement("li");
			listItem.className = "p-4 mb-2.5 bg-white/10 rounded-lg";

			let matchDetails = `<div class="flex flex-col gap-1.5 px-2.5">`;

			// Add date with better formatting
			// const matchDate = new Date(match.match_date);
			// const formattedDate = matchDate.toLocaleString();
			const utcString = match.match_date.replace(" ", "T") + "Z"; // Pat was here; incase of bugs..
			const dateObj = new Date(utcString);
			const formattedDate = dateObj.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

			matchDetails += `<div class="text-sm text-white/70 mb-1.5 text-center">${formattedDate}</div>`;

			// Match type with highlight
			matchDetails += `<div class="font-bold text-base text-blue-400 mb-2 text-center">${match.matchType} Match</div>`;

			// Players section
			matchDetails += `<div class="mb-2.5 flex justify-center flex-wrap gap-2.5">`;
			if (match.player1) matchDetails += `<span class="inline-block px-2 py-1 bg-teal-500/20 rounded">${match.player1}</span>`;
			if (match.player2) matchDetails += `<span class="inline-block px-2 py-1 bg-red-400/20 rounded">${match.player2}</span>`;
			if (match.player3) matchDetails += `<span class="inline-block px-2 py-1 bg-blue-500/20 rounded">${match.player3}</span>`;
			if (match.player4) matchDetails += `<span class="inline-block px-2 py-1 bg-yellow-300/20 rounded">${match.player4}</span>`;
			matchDetails += `</div>`;

			// Score section
			matchDetails += `<div class="grid grid-cols-${getScoreColumnCount(match)} gap-3.5 mb-3 text-center">`;
			if (match.score_player1 !== undefined) matchDetails += `<div>P1: <span class="font-bold">${match.score_player1}</span></div>`;
			if (match.score_player2 !== undefined) matchDetails += `<div>P2: <span class="font-bold">${match.score_player2}</span></div>`;
			if (match.score_player3 !== undefined) matchDetails += `<div>P3: <span class="font-bold">${match.score_player3}</span></div>`;
			if (match.score_player4 !== undefined) matchDetails += `<div>P4: <span class="font-bold">${match.score_player4}</span></div>`;
			matchDetails += `</div>`;

			// Winner/loser section with highlight - centered
			matchDetails += `<div class="text-center mt-1.5">`;
			if (match.winner) {
				matchDetails += `<div class="font-bold text-blue-400">Winner: ${match.winner}</div>`;
			}
			if (match.loser) {
				matchDetails += `<div class="text-white/70">Loser: ${match.loser}</div>`;
			}
			matchDetails += `</div>`;

			matchDetails += `</div>`;

			listItem.innerHTML = matchDetails;
			matchHistoryList.appendChild(listItem);
		});
	}
}

// Helper function to determine how many columns for scores
function getScoreColumnCount(match: any): number {
	let count = 0;
	if (match.score_player1 !== undefined) count++;
	if (match.score_player2 !== undefined) count++;
	if (match.score_player3 !== undefined) count++;
	if (match.score_player4 !== undefined) count++;
	return count || 1;
}

export function getUserMatchHistory(username: string) {
	fetch(`/getMatchHistory?username=${username}`)
		.then(response => {
			if (!response.ok) {
				console.error("Error fetching match history:", response);
				return;
			}
			return response.json();
		})
		.then(matchHistory => {
			renderMatchHistory(matchHistory);
		})
		.catch(error => {
			console.error("Error fetching match history:", error);
		});
}

function loginRequest(loginPlayer: PlayerLogin, game: GameInfo) {
	fetch("/firstlogin", {
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
			if (addFriend) addFriend.classList.remove("hidden");
			getRejectedFriendRequests(loginPlayer.username);
			getUserInfoAndCreateUserInterface(loginPlayer.username);
			getUserMatchHistory(loginPlayer.username);
			// restoreScreenLoggedIn();
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
			return response.json();
		})
		.catch(error => {
			console.error("Error during Login:", error);
		});
}


export function callLoginEventListeners(game: GameInfo) {
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
	showFriendStatus(game);

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
		restoreScreen(game);
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
