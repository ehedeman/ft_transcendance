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
			userStatusInterFace.style.position = "absolute";
			userStatusInterFace.style.left = "0";
			userStatusInterFace.style.top = "0";
			userStatusInterFace.style.backgroundColor = "rgba(145, 148, 145, 0.8)";
			userStatusInterFace.style.width = "200px";
			userStatusInterFace.style.height = "auto";
			userStatusInterFace.style.border = "1px solid #000000ff";
			userStatusInterFace.style.borderRadius = "50px / 30px"; // Makes it oval-shaped Remi
			userStatusInterFace.style.padding = "10px 20px"; // Add some padding for better spacing Remi
			document.body.appendChild(userStatusInterFace);
			userStatusInterFace.innerHTML = `
				<li><strong>Username:</strong> ${username}</li>
				<li><img src="${userInfo.avatarUrl}" alt="${username}'s avatar" style="width:80px; height:80px; border-radius:50%; margin-bottom:10px;" /></li>
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
			listItem.style.padding = "12px";
			listItem.style.textAlign = "center";
			listItem.style.color = "rgba(255,255,255,0.7)";
			matchHistoryList.appendChild(listItem);
		}
		matchHistory.forEach((match: any) => {
			const listItem = document.createElement("li");
			listItem.style.padding = "16px";
			listItem.style.marginBottom = "10px";
			listItem.style.backgroundColor = "rgba(255,255,255,0.1)";
			listItem.style.borderRadius = "8px";

			let matchDetails = `<div style="display: flex; flex-direction: column; gap: 6px; padding: 0 10px;">`;

			// Add date with better formatting
			// const matchDate = new Date(match.match_date);
			// const formattedDate = matchDate.toLocaleString();
			const utcString = match.match_date.replace(" ", "T") + "Z"; // Pat was here; incase of bugs..
			const dateObj = new Date(utcString);
			const formattedDate = dateObj.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

			matchDetails += `<div style="font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 6px; text-align: center;">${formattedDate}</div>`;

			// Match type with highlight
			matchDetails += `<div style="font-weight: bold; font-size: 16px; color: #4facfe; margin-bottom: 8px; text-align: center;">${match.matchType} Match</div>`;

			// Players section
			matchDetails += `<div style="margin-bottom: 10px; display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">`;
			if (match.player1) matchDetails += `<span style="display: inline-block; padding: 4px 8px; background: rgba(75, 192, 192, 0.2); border-radius: 4px;">${match.player1}</span>`;
			if (match.player2) matchDetails += `<span style="display: inline-block; padding: 4px 8px; background: rgba(255, 99, 132, 0.2); border-radius: 4px;">${match.player2}</span>`;
			if (match.player3) matchDetails += `<span style="display: inline-block; padding: 4px 8px; background: rgba(54, 162, 235, 0.2); border-radius: 4px;">${match.player3}</span>`;
			if (match.player4) matchDetails += `<span style="display: inline-block; padding: 4px 8px; background: rgba(255, 206, 86, 0.2); border-radius: 4px;">${match.player4}</span>`;
			matchDetails += `</div>`;

			// Score section
			matchDetails += `<div style="display: grid; grid-template-columns: repeat(${getScoreColumnCount(match)}, 1fr); gap: 15px; margin-bottom: 12px; text-align: center;">`;
			if (match.score_player1 !== undefined) matchDetails += `<div>P1: <span style="font-weight: bold;">${match.score_player1}</span></div>`;
			if (match.score_player2 !== undefined) matchDetails += `<div>P2: <span style="font-weight: bold;">${match.score_player2}</span></div>`;
			if (match.score_player3 !== undefined) matchDetails += `<div>P3: <span style="font-weight: bold;">${match.score_player3}</span></div>`;
			if (match.score_player4 !== undefined) matchDetails += `<div>P4: <span style="font-weight: bold;">${match.score_player4}</span></div>`;
			matchDetails += `</div>`;

			// Winner/loser section with highlight - centered
			matchDetails += `<div style="text-align: center; margin-top: 5px;">`;
			if (match.winner) {
				matchDetails += `<div style="font-weight: bold; color: #4facfe;">Winner: ${match.winner}</div>`;
			}
			if (match.loser) {
				matchDetails += `<div style="color: rgba(255,255,255,0.7);">Loser: ${match.loser}</div>`;
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
