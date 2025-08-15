import { Player, canvasInfo, BallInfo, playerPaddle, GameInfo, TournamentStage, PlayerLogin, PlayerRegistration } from "./frontendStructures.js";
import { tournamentEnd, tournamentLogic, tournamentPlayGame } from "./tournament.js";
// import e{ rounds } from "./server.js";
import { tournamentFinished, showWinnerScreen } from "./tournament.js";
import { userInfo } from "./serverStructures.js";

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

function restoreScreen(): void {
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	const registerModal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const settings = document.getElementById("settings") as HTMLElement;
	const loginModal = document.getElementById("generalLoginModal") as HTMLDivElement;

	if (registerButton) registerButton.style.display = "block";
	if (playSelect) playSelect.style.display = "block";
	if (loginButton) loginButton.style.display = "block";
	if (registerModal) registerModal.style.display = "none";
	if (settings) settings.style.display = "none";
	if (loginModal) loginModal.style.display = "none";
}

function emptyLoginFields(loginType: string): void {
	switch (loginType) {
		case "loginTournament":
			const tournamentPassword = document.getElementById("tournamentPassword") as HTMLInputElement;
			if (tournamentPassword) tournamentPassword.value = "";
			break;
		case "loginGeneral":
			const loginPassword = document.getElementById("loginPassword") as HTMLInputElement;
			if (loginPassword) loginPassword.value = "";
			break;
		case "loginSettings":
			const settingPassword = document.getElementById("settingPassword") as HTMLInputElement;
			if (settingPassword) settingPassword.value = "";
			break;
		case "registerSettings":
			const registerPassword = document.getElementById("registerPassword") as HTMLInputElement;
			if (registerPassword) registerPassword.value = "";
			break;
		default:
			break;
	}
}

/*-------------------------------------settings------------------------------------*/

document.getElementById("settingsDeleteAccount")?.addEventListener("click", () => {
	// delete account from database here

	//not sure of a way to get data on whose acc is being deleted tho
	//at least not wihtout getting too hardcoded
	restoreScreen();
});

// JavaScript to handle avatar click and preview
document.getElementById('avatarPreviewSettings')?.addEventListener('click', function () {
	document.getElementById('avatarUpload')?.click();
});

document.getElementById('avatarUpload')?.addEventListener('change', function (event) {
	if (event) {
		const input = event.target as HTMLInputElement;

		var preview = document.getElementById('avatarPreviewSettings') as HTMLImageElement;
		if (input) {
			const file = input.files && input.files[0];
			if (file) {
				preview.src = URL.createObjectURL(file);
				preview.style.display = "block";
			}
		}
		else {
			preview.src = "default-avatar.png";
			preview.style.display = "none";
		}
	}
});

var userInfoTemp: userInfo;
async function setSettingFields(loginPlayer: PlayerLogin): Promise<boolean> {
	const settingsName = document.getElementById("settingsName") as HTMLInputElement;
	const settingsUsername = document.getElementById("settingsUsername") as HTMLInputElement;
	const settingsPassword = document.getElementById("settingsPassword") as HTMLInputElement;
	const settingsCountry = document.getElementById("settingsCountry") as HTMLInputElement;
	const avatarPreviewSettings = document.getElementById("avatarPreviewSettings") as HTMLImageElement;
	const avatarUpload = document.getElementById("avatarUpload") as HTMLInputElement;

	const response = await fetch("/userInfo", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username: loginPlayer.username })
	});
	const data = await response.json();

	const playerInfo = {
		id: data.id,
		name: data.fullName,
		username: data.alias,
		country: data.country,
		avatar: data.avatarPath, // painful bug
		password: data.password
	};

	settingsName.placeholder = playerInfo.name;
	settingsUsername.placeholder = playerInfo.username;
	settingsPassword.placeholder = "Enter new password";
	settingsCountry.placeholder = playerInfo.country;

	// Set the avatar preview to whatever is in the database
	avatarPreviewSettings.src = playerInfo.avatar;

	settingsName.value = playerInfo.name;
	settingsUsername.value = playerInfo.username;
	settingsPassword.value = "";
	settingsCountry.value = playerInfo.country;

	userInfoTemp = {
		id: playerInfo.id,
		Full_Name: playerInfo.name,
		avatar_url: playerInfo.avatar, // very <- important
		password_hash: playerInfo.password,
		Alias: playerInfo.username,
		Country: playerInfo.country,
		status: "",
		updated_at: "",
		created_at: "",
	};
	// here set fields to what database has currently stored to display in settings
	return true;
}

document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
	e.preventDefault();

	const nameInput = document.getElementById("settingsName") as HTMLInputElement;
	const usernameInput = document.getElementById("settingsUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("settingsPassword") as HTMLInputElement;
	const countryInput = document.getElementById("settingsCountry") as HTMLInputElement;
	const avatarFileInput = document.getElementById("avatarUpload") as HTMLInputElement; // **file input**

	const formData = new FormData();
	formData.append("id", String(userInfoTemp.id));
	formData.append("name", nameInput.value.trim());
	formData.append("username", usernameInput.value.trim());
	formData.append("password", passwordInput.value.trim() || userInfoTemp.password_hash);
	formData.append("country", countryInput.value.trim());

	if (avatarFileInput.files && avatarFileInput.files[0]) {
		formData.append("avatar", avatarFileInput.files[0]); // new avatar
	} else {
		formData.append("avatar_url", userInfoTemp.avatar_url); // keep the one in DB
	}

	fetch("/updateUser", {
		method: "POST",
		body: formData
	})
		.then(res => res.json())
		.then(data => {
			alert(data.message);
			location.reload();
		})
		.catch(err => console.error("Update failed", err));
});



// async function setSettingFields(loginPlayer: PlayerLogin): Promise<boolean> {
// 	const settingsName = document.getElementById("settingsName") as HTMLInputElement;
// 	const settingsUsername = document.getElementById("settingsUsername") as HTMLInputElement;
// 	const settingsPassword = document.getElementById("settingsPassword") as HTMLInputElement;
// 	const settingsCountry = document.getElementById("settingsCountry") as HTMLInputElement;
// 	const avatarPreviewSettings = document.getElementById("avatarPreviewSettings") as HTMLInputElement;
// 	const avatarUpload = document.getElementById("avatarUpload") as HTMLInputElement;
// 	fetch("/userInfo", {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify({ username: loginPlayer.username })
// 	})
// 	.then(response => response.json())
// 	.then(data => {
// 		var	playerInfo = {
// 			id: data.id, 
// 			name: data.fullName,
// 			username: data.alias,
// 			country: data.country,
// 			avatar: data.avatarPath,
// 			password: data.password
// 		}
// 		// avatarUpload.src = playerInfo.avatar;
// 		settingsName.placeholder = playerInfo.name;
// 		settingsUsername.placeholder = playerInfo.username;
// 		settingsPassword.placeholder = "Enter new password";
// 		settingsCountry.placeholder = playerInfo.country;
// 		avatarUpload.src = playerInfo.avatar;
// 		avatarPreviewSettings.src = playerInfo.avatar;
// 		//set values so settings can be overwritten and arent required
// 		settingsName.value = playerInfo.name;
// 		settingsUsername.value = playerInfo.username;
// 		settingsPassword.value = "";
// 		settingsCountry.value = playerInfo.country;
// 		userInfoTemp = {
// 			id: playerInfo.id,
// 			Full_Name: playerInfo.name,
// 			avatar_url: playerInfo.avatar,
// 			password_hash: playerInfo.password,
// 			Alias: playerInfo.username,
// 			Country: playerInfo.country,
// 			status: "",
// 			updated_at: "",
// 			created_at: "",
// 		}
// 	})
// 	// here set fields to what database has currently stored to display in settings

// 	return true;
// }

// document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const nameInput = document.getElementById("settingsName") as HTMLInputElement;
//     const usernameInput = document.getElementById("settingsUsername") as HTMLInputElement;
//     const passwordInput = document.getElementById("settingsPassword") as HTMLInputElement;
//     const countryInput = document.getElementById("settingsCountry") as HTMLInputElement;
//     const avatarFileInput = document.getElementById("avatarUpload") as HTMLInputElement; 

//     const name = nameInput.value.trim();
//     const username = usernameInput.value.trim();
//     const password = passwordInput.value.trim(); // empty means "keep old password"
//     const country = countryInput.value.trim();

//     if (!username || !name || !country) {
//         alert("Name, username, and country cannot be empty!");
//         return;
//     }
//      console.log(userInfoTemp);
//     const formData = new FormData();
// 	formData.append("id", String(userInfoTemp.id));
//     formData.append("name", name);
//     formData.append("username", username); 
//     formData.append("password", password || userInfoTemp.password_hash);
//     formData.append("country", country);

//     if (avatarFileInput.files && avatarFileInput.files[0]) {
//         formData.append("avatar", avatarFileInput.files[0]);
//     } else {
//         formData.append("avatar_url", userInfoTemp.avatar_url); // keep current avatar
//     }

//     fetch("/updateUser", {
//         method: "POST",
//         body: formData
//     })
//     .then(res => res.json())
//     .then(data => {
//         alert(data.message);
//         location.reload();
//     })
//     .catch(err => console.error("Update failed", err));
// });


async function loginToSettings(): Promise<boolean> {
	const usernameInput = document.getElementById("settingsLoginUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("settingsLoginPassword") as HTMLInputElement;
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
			emptyLoginFields("loginSettings");
			return false;
		}
		emptyLoginFields("loginSettings");
		setSettingFields(loginPlayer);
		return true;
	} catch (error) {
		console.error("Error during Login:", error);
		return false;
	}
}


document.getElementById("settingsLogin")?.addEventListener("submit", async (e) => {
	e.preventDefault();
	const success = await loginToSettings();

	if (success) {
		hideSettingsLogin();
		showSettingsForm();
	} else {
		hideSettings();
		hideSettingsForm();
		hideSettingsLogin();
		document.addEventListener("keydown", handleKeydown);
		document.addEventListener("keyup", handleKeyup);
		restoreScreen();
	}
});


function showSettings(): void {
	const settings = document.getElementById("settings") as HTMLElement;
	if (settings) settings.style.display = "flex";
}

function hideSettings(): void {
	const settings = document.getElementById("settings") as HTMLElement;
	if (settings) settings.style.display = "none";
}

function hideSettingsForm(): void {
	const settingsForm = document.getElementById("settingsForm") as HTMLElement;
	if (settingsForm) settingsForm.style.display = "none";
}


function showSettingsForm(): void {
	const settingsForm = document.getElementById("settingsForm") as HTMLElement;
	if (settingsForm) settingsForm.style.display = "flex";

	const settingsHeader = document.getElementById("settingsHeader") as HTMLElement;
	if (settingsHeader) settingsHeader.textContent = "Settings";
}

function hideSettingsLogin(): void {
	const settingsLogin = document.getElementById("settingsLogin") as HTMLElement;
	if (settingsLogin) settingsLogin.style.display = "none";
}

function showSettingsLogin(): void {
	const settingsLogin = document.getElementById("settingsLogin") as HTMLElement;
	if (settingsLogin) settingsLogin.style.display = "flex";
	const settingsHeader = document.getElementById("settingsHeader") as HTMLElement;
	if (settingsHeader) settingsHeader.textContent = "Log in to continue.";
}

document.getElementById("settingsButton")?.addEventListener("click", () => {

	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";

	showSettings();
	hideSettingsForm();
	showSettingsLogin();
	document.removeEventListener("keydown", handleKeydown);
	document.removeEventListener("keyup", handleKeyup);
});

document.getElementById("showSettingsPassword")?.addEventListener("click", () => {
	const passwordInput = document.getElementById("settingsPassword") as HTMLInputElement;
	if (passwordInput.type === "password") {
		passwordInput.type = "text";
	} else {
		passwordInput.type = "password";
	}
});

document.getElementById("settingsCancel")?.addEventListener("click", () => {
	const settings = document.getElementById("settings") as HTMLElement;
	if (settings) settings.style.display = "none";
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("keyup", handleKeyup);
	restoreScreen();
});


/*--------------------------registration modal declaration--------------------------*/





function showGeneralRegistrationModal(game: GameInfo) {
	const modal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const usernameInput = document.getElementById("registerUsername") as HTMLInputElement;
	const passwordInput = document.getElementById("registerPassword") as HTMLInputElement;
	const countryInput = document.getElementById("registerCountry") as HTMLInputElement;
	const nameInput = document.getElementById("registerName") as HTMLInputElement;
	const avatarInput = document.getElementById("registerAvatar") as HTMLInputElement;
	if (avatarInput) {
		avatarInput.value = "";
		avatarInput.type = "file";
		avatarInput.className = "mb-2 px-2 py-1 border rounded block";
		// avatarInput.required = false; // optional
	}
	nameInput.value = "";
	usernameInput.value = "";
	passwordInput.value = "";
	countryInput.value = "";
	usernameInput.className = "mb-2 px-2 py-1 border rounded block";
	nameInput.className = "mb-2 px-2 py-1 border rounded block";
	countryInput.className = "mb-2 px-2 py-1 border rounded block";
	modal.style.display = "flex";
}

function hideGeneralRegistrationModal() {
	const modal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	modal.style.display = "none";
}

document.getElementById("registerButton")?.addEventListener("click", () => {
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";
	showGeneralRegistrationModal(game);
});

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM is fully loaded and parsed!");

	// Get avatar input and set up preview once
	const avatarInput = document.getElementById("registerAvatar") as HTMLInputElement;
	avatarInput.addEventListener("change", () => {
		const file = avatarInput.files && avatarInput.files[0];
		const preview = document.getElementById("avatarPreview") as HTMLImageElement;
		if (file) {
			preview.src = URL.createObjectURL(file);
			preview.style.display = "block";
		} else {
			preview.src = "default-avatar.png";
			preview.style.display = "none";
		}
	});

	// Handle registration form submission
	document.getElementById("generalRegistrationForm")?.addEventListener("submit", (e) => {
		e.preventDefault();

		const nameInput = document.getElementById("registerName") as HTMLInputElement;
		const usernameInput = document.getElementById("registerUsername") as HTMLInputElement;
		const passwordInput = document.getElementById("registerPassword") as HTMLInputElement;
		const countryInput = document.getElementById("registerCountry") as HTMLInputElement;
		// Reuse avatarInput from above
		const name = nameInput.value.trim();
		const username = usernameInput.value.trim();
		const password = passwordInput.value.trim();
		const country = countryInput.value.trim();
		const avatarFile = avatarInput.files && avatarInput.files[0];

		if (!username || !password || !name || !country) {
			alert("Name, username, password and country cannot be empty!");
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("username", username);
		formData.append("password", password);
		formData.append("country", country);
		if (avatarFile) {
			formData.append("avatar", avatarFile);
		}

		fetch("/register", {
			method: "POST",
			body: formData
		})
			.then(response => {
				if (!response.ok) {
					alert("Registration failed. Please try again_am _here.");
					return;
				}
				console.log("Registration successful:", response);
				alert("Registration successful! You can now log in.");
				emptyLoginFields("registerSettings");
				hideGeneralRegistrationModal();
				restoreScreen();
				// location.reload(); // reload page after registration
				return response.json();
			})
			.catch(error => {
				console.error("Error during Registration:", error);
			});
	});
});


document.getElementById("generalCancelRegistration")?.addEventListener("click", () => {
	hideGeneralRegistrationModal();
	restoreScreen();
	// location.reload();
});


/*-----------------------------login modal declaration------------------------------*/



function showGeneralLoginModal(game: GameInfo) {
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

document.getElementById("loginButton")?.addEventListener("click", () => {
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";

	showGeneralLoginModal(game);
});

/** Create WebSocket connection */
function createWebSocketConnection(username: string) {
	game.websocket = new WebSocket(`ws://localhost:3000/ws?username=${username}`);

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
}

function getFriendList(username: string) {
	fetch(`/getFriendList?username=${encodeURIComponent(username)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch friend list.");
			}
			return response.json();
		})
		.then(data => {
			console.log("Friend list:", data.friendList);
			game.friendList = data.friendList || [];
			const friendListElement = document.getElementById("friendList");
			if (friendListElement) {
				friendListElement.innerHTML = ""; // Clear existing list
				for (const friend of game.friendList) {
					const listItem = document.createElement("li");
					listItem.textContent = friend;
					listItem.id = friend;
					listItem.style.cursor = "pointer";
					friendListElement.appendChild(listItem);
				}
			}
		})
		.catch(error => {
			console.error("Error fetching friend list:", error);
		});
}

function getFriendRequestList(username: string) {
	fetch(`/getFriendRequestList?username=${encodeURIComponent(username)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch friend request list.");
			}
			return response.json();
		})
		.then(data => {
			console.log("Friend request list:", data.friendRequestList);
			game.friendRequestList = data.friendRequestList || [];
			if (game.friendRequestList.length === 0) {
				const friendRequestListElement = document.getElementById("friendRequestsList");
				if (friendRequestListElement) {
					friendRequestListElement.innerHTML = "<li>No friend requests</li>";
				}
			}
			const friendRequestListElement = document.getElementById("friendRequestsList");
			if (friendRequestListElement) {
				friendRequestListElement.innerHTML = ""; // Clear existing list
				for (const request of game.friendRequestList) {
					const listItem = document.createElement("li");
					listItem.textContent = request;
					listItem.id = request;
					listItem.style.cursor = "pointer";
					friendRequestListElement.appendChild(listItem);
				}
			}
		})
		.catch(error => {
			console.error("Error fetching friend request list:", error);
		});
}

function getRejectedFriendRequests(username: string) {
	fetch(`/getRejectedFriendRequests?username=${encodeURIComponent(username)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch rejected friend requests.");
			}
			return response.json();
		})
		.then(data => {
			console.log("Rejected friend requests:", data.rejectedFriendRequests);
			game.rejectedFriendRequests = data.rejectedFriendRequests || [];
			for (const request of game.rejectedFriendRequests) {
				alert(`Rejected friend request from: ${request}`);
			}
		})
		.catch(error => {
			console.error("Error fetching rejected friend requests:", error);
		});
}

document.getElementById("friendRequestsList")?.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if (target.tagName === "LI") {
		console.log(`${target.textContent} clicked`);
		const friendName = target.id;
		const reply = confirm(`Do you want to accept the friend request from ${friendName}?`);
		if (reply) {
			fetch(`/acceptFriendRequest?username=${encodeURIComponent(friendName)}&friendname=${encodeURIComponent(game.username)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("Failed to send accept friend request.");
					}
					return response.json();
				})
				.then(data => {
					console.log("Friend request accepted:", data);
					getFriendList(game.username);
					getFriendRequestList(game.username);
				})
				.catch(error => {
					console.error("Error accepting friend request:", error);
				});
		} else {
			fetch(`/rejectFriendRequest?username=${encodeURIComponent(friendName)}&friendname=${encodeURIComponent(game.username)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("Failed to send reject friend request.");
					}
					return response.json();
				})
				.then(data => {
					console.log("Friend request rejected:", data);
					getFriendList(game.username);
					getFriendRequestList(game.username);
				})
				.catch(error => {
					console.error("Error rejecting friend request:", error);
				});
		}
	}
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
			emptyLoginFields("loginGeneral");
			game.players.push({
				name: loginPlayer.username,
				gamesLost: 0,
				gamesWon: 0,
				playerscore: 0,
			}
			);
			createWebSocketConnection(loginPlayer.username);
			// get the friend list
			getFriendList(loginPlayer.username);
			getFriendRequestList(loginPlayer.username);
			getRejectedFriendRequests(loginPlayer.username);
			// restoreScreen();
			// location.reload();
			return response.json();
		})
		.catch(error => {
			console.error("Error during Login:", error);
		});
});

// ------------------------------------------------add friend-------------------------------------
document.getElementById("sendMessage")?.addEventListener("click", () => {
	const input = document.getElementById("inputMessageBox") as HTMLInputElement;
	const inputMessage: string = input.value.trim();
	if (game.websocket) {
		game.websocket.send(JSON.stringify({
			type: "privateMessage",
			target: game.sendMessageTo,
			from: game.username,
			message: inputMessage
		}));
	}
	input.value = "";
});

document.getElementById("friendList")?.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if (target.tagName === "LI") {
		console.log(`${target.textContent} clicked`);
		game.sendMessageTo = target.id;
		console.log(`Message will be sent to: ${game.sendMessageTo}`);
		fetch(`/getChatHistory?username=${encodeURIComponent(game.username)}&friendname=${encodeURIComponent(game.sendMessageTo)}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("Failed to fetch chat history.");
				}
				return response.json();
			})
			.then(data => {
				console.log("Chat history:", data.chatHistory);
				game.chatHistory = data.chatHistory || [];
				const chatHistoryElement = document.getElementById("friendList2");
				if (chatHistoryElement) {
					chatHistoryElement.innerHTML = ""; // Clear existing chat history
					for (const message of game.chatHistory) {
						const messageElement = document.createElement("LI");
						messageElement.textContent = message;
						chatHistoryElement.appendChild(messageElement);
					}
					chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
				}
			})
			.catch(error => {
				console.error("Error fetching chat history:", error);
			});
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

document.getElementById("addFriend")?.addEventListener("click", () => {
	const friendName = prompt("Enter the name of the friend to add:");
	if (friendName) {
		if (game.friendList.includes(friendName)) {
			alert("Friend already added!");
		} else if (game.username === friendName) {
			alert("You cannot add yourself as a friend!");
		} else {
			fetch(`/addFriend?nameToAdd=${encodeURIComponent(friendName)}&accountName=${encodeURIComponent(game.username)}`)
				.then(response => {
					if (response.status === 202) {
						alert("Friend request sent!");
					} else if (response.ok) {
						alert("Friend added successfully!");
						const friendList = document.getElementById("friendList");
						if (friendList) {
							const newFriendItem = document.createElement("li");
							newFriendItem.id = friendName;
							newFriendItem.textContent = friendName;
							friendList.appendChild(newFriendItem);
						}
						fetch(`/addFriendlist`, {
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								username: game.username,
								friendname: friendName
							})
						})
					} else {
						alert("Failed to add friend.");
					}
				})
		}
	} else {
		alert("Friend name cannot be empty!");
	}
});

function handleFriendRequest(data: any) {
	const friendName = data.from;
	const result = confirm(`Do you want to accept the friend request from ${friendName}?`);
	if (result) {
		game.websocket?.send(JSON.stringify({ reply: "accept" }));
		const friendList = document.getElementById("friendList");
		if (friendList) {
			const newFriendItem = document.createElement("li");
			newFriendItem.id = friendName;
			newFriendItem.style.cursor = "pointer";
			newFriendItem.textContent = friendName;
			friendList.appendChild(newFriendItem);
		}
	} else {
		game.websocket?.send(JSON.stringify({ reply: "decline" }));
	}
}

function handlePrivateMessage(data: any) {
	const { from, message } = data;
	const chatHistoryElement = document.getElementById("friendList2");
	if (chatHistoryElement) {
		const messageElement = document.createElement("LI");
		messageElement.textContent = `${from}: ${message}`;
		chatHistoryElement.appendChild(messageElement);
		chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
	}
}

function handleWebSocketMessage(event: MessageEvent) {
	const data = JSON.parse(event.data);
	switch (data.type) {
		case "friendRequest":
			handleFriendRequest(data);
			break;
		case "privateMessage":
			handlePrivateMessage(data);
			break;
	}
};




document.getElementById("CancelGeneralLogin")?.addEventListener("click", () => {
	hideGeneralLoginModal();
	restoreScreen();
	// location.reload();
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
					// location.reload();
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

document.getElementById("tournamentFinishContinue")?.addEventListener("click", () => {
	//game.t.finishScreenRunning = false;
	tournamentEnd(0, game);
	restoreScreen();
	// location.reload();
});

document.getElementById("tournamentResetButton")?.addEventListener("click", () => {
	// tournamentEnd(0, game);
	restoreScreen();
	// location.reload();
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
	tournamentEnd(1, game);
	restoreScreen();
	// location.reload();
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
