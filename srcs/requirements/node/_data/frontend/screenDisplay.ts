import { restoreMatchState } from "./twoPlayerMatch_local.js";
import { ctx } from "./index.js";
import { GameInfo } from "./frontendStructures.js";

export function restoreScreen(game:GameInfo): void {
	const registerButton = document.getElementById("registerButton");
	const settingsButton = document.getElementById("settingsButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	const registerModal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const settings = document.getElementById("settings") as HTMLElement;
	const loginModal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const preview = document.getElementById("registerAvatarImg") as HTMLImageElement;
	const friendStuff = document.getElementById("friendStuff") as HTMLDivElement;
	const messages = document.getElementById("messages");
	const logoutButton = document.getElementById("logoutButton");
	const matchHistory = document.getElementById("matchHistory");
	restoreMatchState();
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

	if (messages) messages.style.display = "none";
	if (logoutButton) logoutButton.style.display = "none";
	if (preview) preview.src = "./avatars/default-avatar.png";
	if (registerButton) registerButton.style.display = "block";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "block";
	if (registerModal) registerModal.style.display = "none";
	if (settings) settings.style.display = "none";
	if (loginModal) loginModal.style.display = "none";
	if (settingsButton) settingsButton.style.display = "none";
	if (friendStuff) friendStuff.style.display = "none";
	if (matchHistory) matchHistory.style.display = "none";
}

export function hideDefaultButtons(): void
{
	const registerButton = document.getElementById("registerButton");
	const settingsButton = document.getElementById("settingsButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	const registerModal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const settings = document.getElementById("settings") as HTMLElement;
	const loginModal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const friendStuff = document.getElementById("friendStuff") as HTMLDivElement;
	const logoutButton = document.getElementById("logoutButton");
	const messages = document.getElementById("messages");
	const matchHistory = document.getElementById("matchHistory");

	if (messages) messages.style.display = "none";
	if (logoutButton) logoutButton.style.display = "none";
	if (registerButton) registerButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";
	if (registerModal) registerModal.style.display = "none";
	if (settings) settings.style.display = "none";
	if (loginModal) loginModal.style.display = "none";
	if (settingsButton) settingsButton.style.display = "none";
	if (friendStuff) friendStuff.style.display = "none";
	if (matchHistory) matchHistory.style.display = "none";
}

export function restoreScreenLoggedIn(): void {
	const registerButton = document.getElementById("registerButton");
	const settingsButton = document.getElementById("settingsButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	const logoutButton = document.getElementById("logoutButton");
	const registerModal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const settings = document.getElementById("settings") as HTMLElement;
	const loginModal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const preview = document.getElementById("registerAvatarImg") as HTMLImageElement;
	const friendStuff = document.getElementById("friendStuff") as HTMLDivElement;
	const messages = document.getElementById("messages");
	const matchHistory = document.getElementById("matchHistory");

	restoreMatchState();

	if (messages) messages.style.display = "block";
	if (logoutButton) logoutButton.style.display = "block";
	if (registerButton) registerButton.style.display = "block";
	if (friendStuff) friendStuff.style.display = "block";
	if (settingsButton) settingsButton.style.display = "block";
	if (playSelect) playSelect.style.display = "block";
	if (loginButton) loginButton.style.display = "none";
	if (settings) settings.style.display = "none";
	if (loginModal) loginModal.style.display = "none";
	if (registerModal) registerModal.style.display = "none";
	if (preview) preview.src = "./avatars/default-avatar.png";
	if (matchHistory) matchHistory.style.display = "block";

}
