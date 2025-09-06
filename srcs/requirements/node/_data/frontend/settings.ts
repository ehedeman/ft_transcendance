import { hideDefaultButtons, restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { handleKeydown, handleKeyup, navigate } from "./index.js";
import { GameInfo, pageIndex, PlayerLogin } from "./frontendStructures.js";

import { userInfo } from "./serverStructures.js"
import { hideEverything } from "./screenDisplay.js"
import { logout } from "./logout.js";

var settingsAlreadyLoggedIn: boolean = false;
//to determine whether user was logged in before accessing settings
//or if the user had first logged in in the settings

export function settingsStart(game: GameInfo) {
	hideEverything();

	showSettings();
	hideSettingsForm();
	if (game.currentlyLoggedIn.name === "default") {
		settingsAlreadyLoggedIn = false;
		showSettingsLogin();
		document.removeEventListener("keydown", handleKeydown);
		document.removeEventListener("keyup", handleKeyup);
	}
	else {
		settingsAlreadyLoggedIn = true;
		document.removeEventListener("keydown", handleKeydown);
		document.removeEventListener("keyup", handleKeyup);
		setSettingFields(game.currentlyLoggedIn.name, game.userInfoTemp);
		hideSettingsLogin();
		showSettingsForm();
	}
}

async function setSettingFields(_username: string, userInfoTemp: userInfo): Promise<boolean> {
	const settingsName = document.getElementById("settingsName") as HTMLInputElement;
	const settingsUsername = document.getElementById("settingsUsername") as HTMLInputElement;
	const settingsPassword = document.getElementById("settingsPassword") as HTMLInputElement;
	const settingsCountry = document.getElementById("settingsCountry") as HTMLInputElement;
	const avatarPreviewSettings = document.getElementById("avatarPreviewSettings") as HTMLImageElement;

	const response = await fetch("/userInfo", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username: _username })
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
	console.log("ID: " + playerInfo.id);

	userInfoTemp.id = playerInfo.id;
	userInfoTemp.Full_Name = playerInfo.name;
	userInfoTemp.avatar_url = playerInfo.avatar; // very <- important
	userInfoTemp.password_hash = playerInfo.password;
	userInfoTemp.Alias = playerInfo.username;
	userInfoTemp.Country = playerInfo.country;
	userInfoTemp.status = "";
	userInfoTemp.updated_at = "";
	userInfoTemp.created_at = "";

	console.log("ID after: " + userInfoTemp.id);
	// here set fields to what database has currently stored to display in settings
	return true;
}

export function showSettings(): void {
	const settings = document.getElementById("settings") as HTMLElement;
	if (settings) settings.classList.remove("hidden");
}

function hideSettings(): void {
	const settings = document.getElementById("settings") as HTMLElement;
	if (settings) settings.classList.add("hidden");
}

function hideSettingsForm(): void {
	const settingsForm = document.getElementById("settingsForm") as HTMLElement;
	if (settingsForm) settingsForm.classList.add("hidden");
	const saveButton = document.getElementById("settingsSave") as HTMLElement;
	const deleteButton = document.getElementById("settingsDeleteAccount") as HTMLElement;
	const showPasswordButton = document.getElementById("showSettingsPassword") as HTMLElement;
	if (saveButton) saveButton.classList.add("hidden");
	if (deleteButton) deleteButton.classList.add("hidden");
	if (showPasswordButton) showPasswordButton.classList.add("hidden");
}


function showSettingsForm(): void {
	const settingsForm = document.getElementById("settingsForm") as HTMLElement;
	if (settingsForm) settingsForm.classList.remove("hidden");

	const settingsHeader = document.getElementById("settingsHeader") as HTMLElement;
	if (settingsHeader) settingsHeader.textContent = "Settings";
	const saveButton = document.getElementById("settingsSave") as HTMLElement;
	const deleteButton = document.getElementById("settingsDeleteAccount") as HTMLElement;
	const showPasswordButton = document.getElementById("showSettingsPassword") as HTMLElement;
	if (saveButton) saveButton.classList.remove("hidden");
	if (deleteButton) deleteButton.classList.remove("hidden");
	if (showPasswordButton) showPasswordButton.classList.remove("hidden");
}

function hideSettingsLogin(): void {
	const settingsLogin = document.getElementById("settingsLogin") as HTMLElement;
	if (settingsLogin) settingsLogin.classList.add("hidden");
}

function showSettingsLogin(): void {
	const settingsLogin = document.getElementById("settingsLogin") as HTMLElement;
	if (settingsLogin) settingsLogin.classList.remove("hidden");
	const settingsHeader = document.getElementById("settingsHeader") as HTMLElement;
	if (settingsHeader) settingsHeader.textContent = "Log in to continue.";
}

async function loginToSettings(game: GameInfo): Promise<boolean> {
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
		game.currentlyLoggedIn.name = loginPlayer.username;
		setSettingFields(game.currentlyLoggedIn.name, game.userInfoTemp);
		return true;
	} catch (error) {
		console.error("Error during Login:", error);
		emptyLoginFields("loginSettings");
		return false;
	}
}

export function callSettingsEventlisteners(game: GameInfo) {
	document.getElementById("settingsDeleteAccount")?.addEventListener("click", () => {
		let username: string = game.currentlyLoggedIn.name;
		logout(game);
		fetch("/deleteUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username: username })
		})
			.then(response => {
				if (!response.ok) {
					const message: string = response.status === 401 ? 'Username not found' : 'deletion failed. Please try again.';
					alert(message);
					return;
				}
				alert("Account deleted successfully!");

				game.currentlyLoggedIn.name = "default";
				game.currentlyLoggedIn.gamesLost = 0;
				game.currentlyLoggedIn.gamesWon = 0;
				game.currentlyLoggedIn.playerscore = 0;

				// restoreScreen(game);
				navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
				return response.json();
			})
			.catch(error => {
				console.error("Error during deletion:", error);
			});
	});
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
					preview.classList.remove("hidden");
				}
			}
			else {
				preview.src = "./avatars/default-avatar.png";
				preview.classList.add("hidden");
			}
		}
	});

	document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
		e.preventDefault();

		const nameInput = document.getElementById("settingsName") as HTMLInputElement;
		const usernameInput = document.getElementById("settingsUsername") as HTMLInputElement;
		const passwordInput = document.getElementById("settingsPassword") as HTMLInputElement;
		const countryInput = document.getElementById("settingsCountry") as HTMLInputElement;
		const avatarFileInput = document.getElementById("avatarUpload") as HTMLInputElement; // **file input**

		console.log(game.userInfoTemp.id);
		console.log(usernameInput.value);
		const formData = new FormData();
		formData.append("id", String(game.userInfoTemp.id));
		formData.append("name", nameInput.value.trim());
		formData.append("username", usernameInput.value.trim());
		formData.append("password", passwordInput.value.trim() || game.userInfoTemp.password_hash);
		formData.append("country", countryInput.value.trim());

		if (nameInput.value.length > 6) {
			alert("Alias must below 6 characters!");
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
			return;
		}
		if (avatarFileInput.files && avatarFileInput.files[0]) {
			formData.append("avatar", avatarFileInput.files[0]); // new avatar
		} else {
			formData.append("avatar_url", game.userInfoTemp.avatar_url); // keep the one in DB
		}
		if (passwordInput.value.trim() ||
			game.userInfoTemp.Full_Name !== nameInput.value.trim() ||
				game.userInfoTemp.Alias !== usernameInput.value.trim() ||
					game.userInfoTemp.Country !== countryInput.value.trim())
		{
			logout(game);
			fetch("/updateUser", {
				method: "POST",
				body: formData
			})
				.then(res => res.json())
				.then(data => {
					alert(data.message);
					// if (settingsAlreadyLoggedIn === true) {
					// 	game.currentlyLoggedIn.name = nameInput.value.trim();
					// }
					navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
				})
				.catch(err => console.error("Update failed", err));
		}
		else
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
	});

	document.getElementById("settingsLogin")?.addEventListener("submit", async (e) => {
		e.preventDefault();
		const success = await loginToSettings(game);

		if (success) {
			hideSettingsLogin();
			showSettingsForm();
			navigate(game.availablePages[pageIndex.SETTINGS], "", game);
		} else {
			hideSettings();
			hideSettingsForm();
			hideSettingsLogin();
			document.addEventListener("keydown", handleKeydown);
			document.addEventListener("keyup", handleKeyup);
			navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
			emptyLoginFields("loginSettings");
			// restoreScreen(game);
		}
	});

	document.getElementById("settingsButton")?.addEventListener("click", () => {
		navigate(game.availablePages[pageIndex.SETTINGS], "", game);
		// settingsStart(game);
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
		if (settings) settings.classList.add("hidden");
		document.addEventListener("keydown", handleKeydown);
		document.addEventListener("keyup", handleKeyup);
		emptyLoginFields("loginSettings");
		restoreScreen(game);
		if (settingsAlreadyLoggedIn === true) {
			restoreScreenLoggedIn();
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
			// const logoutButton = document.getElementById ("logoutButton") as HTMLElement;
			// if (logoutButton) logoutButton.classList.remove("hidden");
			// const loginButton = document.getElementById ("loginButton") as HTMLElement;
			// if (loginButton) loginButton.classList.add("hidden");
			// const playSelect = document.getElementById ("playSelect") as HTMLElement;
			// if (playSelect) playSelect.classList.remove("hidden");
		}
		else {
			game.currentlyLoggedIn.name = "default";
			navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
		}
	});
}

