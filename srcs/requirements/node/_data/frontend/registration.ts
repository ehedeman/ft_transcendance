import { GameInfo, pageIndex } from "./frontendStructures.js";
import { navigate } from "./index.js";
import { emptyLoginFields } from "./inputFieldHandling.js";

export function showGeneralRegistrationModal() {
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

export function hideGeneralRegistrationModal() {
	const modal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	modal.style.display = "none";
}

import { restoreScreenLoggedIn, restoreScreen } from "./screenDisplay.js";

export function callRegistrationEventListeners(game:GameInfo)
{
	document.getElementById("showRegisterPassword")?.addEventListener("click", () => 
	{
		const passwordInput = document.getElementById("registerPassword") as HTMLInputElement;
		if (passwordInput.type === "password") {
			passwordInput.type = "text";
		} else {
			passwordInput.type = "password";
		}
	});
	document.getElementById("registerButton")?.addEventListener("click", () => {
		navigate(game.availablePages[pageIndex.REGISTER], "" ,game);
		// const registerButton = document.getElementById("registerButton");
		// const playSelect = document.getElementById("playSelect");
		// const loginButton = document.getElementById("loginButton");
		// if (registerButton) registerButton.style.display = "none";
		// if (playSelect) playSelect.style.display = "none";
		// if (loginButton) loginButton.style.display = "none";
		// showGeneralRegistrationModal();
	});


	document.addEventListener("DOMContentLoaded", () => 
	{
		console.log("DOM is fully loaded and parsed!");

		// Get avatar input and set up preview once
		const avatarInput = document.getElementById("registerAvatar") as HTMLInputElement;
		avatarInput.addEventListener("change", () => 
		{
			const file = avatarInput.files && avatarInput.files[0];
			const preview = document.getElementById("registerAvatarImg") as HTMLImageElement;
			if (file) {
				preview.src = URL.createObjectURL(file);
				preview.style.display = "block";
			} else {
				preview.src = "./avatars/default-avatar.png";
				preview.style.display = "none";
			}
		});

		// Handle registration form submission
		document.getElementById("generalRegistrationForm")?.addEventListener("submit", (e) => 
		{
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

			// TODO: remember to uncomment this
			// if (name.length < 7 || name.length > 50) {
			// 	alert("Name must be between 7 and 50 characters long.");
			// 	navigate(game.availablePages[pageIndex.HOME], "", game);
			// 	return;
			// }
			if (username.length > 6) {
				alert("Alias must be less than 6 characters long.");
				navigate(game.availablePages[pageIndex.HOME], "", game);
				return;
			}

			fetch("/register", 
			{
				method: "POST",
				body: formData
			})
			.then(response =>
			{
				if (!response.ok) {
					alert("Registration failed. Please try again_am _here.");
					return;
				}
				console.log("Registration successful:", response);
				alert("Registration successful! You can now log in.");
				emptyLoginFields("registerSettings");
				// hideGeneralRegistrationModal();
				// restoreScreen(game);
				navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
				return response.json();
			})
			.catch(error => 
			{
				console.error("Error during Registration:", error);
			});
		});
	});


	document.getElementById("generalCancelRegistration")?.addEventListener("click", () =>
	{
		// hideGeneralRegistrationModal();
		// restoreScreen(game);
		navigate(game.availablePages[pageIndex.HOME], "loggedOut", game);
		if (game.currentlyLoggedIn.name !== 'default') {
			restoreScreenLoggedIn();
		} else {
			restoreScreen(game);
		}
	});
}