import { restoreMatchState } from "./twoPlayerMatch_local.js";
import { ctx } from "./index.js";
import { GameInfo } from "./frontendStructures.js";

export function restoreScreen(game: GameInfo): void {
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
	const dashboardButton = document.getElementById("dashboardButton");
	const dashboardView = document.getElementById("dashboardView");
	const globalDashboardButton = document.getElementById("globalDashboardButton");
	const globalDashboardView = document.getElementById("globalDashboardView");
	restoreMatchState();
	//const leaveGameButton = document.getElementById("leaveGameButton");
	ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

	//if (leaveGameButton) leaveGameButton.style.display = "none";
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
	if (dashboardButton) dashboardButton.style.display = "none";
	if (dashboardView) dashboardView.style.display = "none";
	if (globalDashboardButton) globalDashboardButton.style.display = "none";
	if (globalDashboardView) globalDashboardView.style.display = "none";
}

export function hideDefaultButtons(): void {
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
	hideEverything();
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
	const addFriend = document.getElementById("addFriend");
	const dashboardButton = document.getElementById("dashboardButton");
	const globalDashboardButton = document.getElementById("globalDashboardButton");

	restoreMatchState();

	if (messages) messages.style.display = "block";
	if (logoutButton) logoutButton.style.display = "block";
	if (registerButton) registerButton.style.display = "none";
	if (friendStuff) friendStuff.style.display = "block";
	if (settingsButton) settingsButton.style.display = "block";
	if (playSelect) playSelect.style.display = "block";
	if (loginButton) loginButton.style.display = "none";
	if (settings) settings.style.display = "none";
	if (loginModal) loginModal.style.display = "none";
	if (registerModal) registerModal.style.display = "none";
	if (preview) preview.src = "./avatars/default-avatar.png";
	if (matchHistory) matchHistory.style.display = "block";
	if (addFriend) addFriend.style.display = "block";
	if (dashboardButton) dashboardButton.style.display = "block";
	if (globalDashboardButton) globalDashboardButton.style.display = "block";

}

export function hideEverything() {
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	const logoutButton = document.getElementById("logoutButton");
	const WinnerScreen = document.getElementById("WinnerScreen");
	const message = document.getElementById("messages");
	const matchHistory = document.getElementById("matchHistory");
	const tournamentRegistrationModal = document.getElementById("tournamentRegistrationModal");
	const tournamentResults = document.getElementById("tournamentResults");
	const tournamentFinishContinue = document.getElementById("tournamentFinishContinue");
	const tournamentResetButton = document.getElementById("tournamentResetButton");
	const generalLoginModal = document.getElementById("generalLoginModal");
	const generalRegistrationModal = document.getElementById("generalRegistrationModal");
	const settings = document.getElementById("settingsButton");
	const friendStuff = document.getElementById("friendStuff");
	const addFriend = document.getElementById("addFriend");
	const twoPlayerMatchContainer = document.getElementById("twoPlayerMatchContainer");
	const twoPlayerMatchLogin = document.getElementById("twoPlayerMatchLogin");
	const twoPlayerMatchInviteForm = document.getElementById("twoPlayerMatchInviteForm");
	const multiplayerMatchInviteContainer = document.getElementById("multiplayerMatchInviteContainer");
	const multiplayerMatchInviteForm1 = document.getElementById("multiplayerMatchInviteForm1");
	const multiplayerMatchInviteForm2 = document.getElementById("multiplayerMatchInviteForm2");
	const multiplayerMatchInviteForm3 = document.getElementById("multiplayerMatchInviteForm3");
	//const leaveGameButton = document.getElementById("leaveGameButton");
	//if (leaveGameButton) leaveGameButton.style.display = "none";
	if (registerButton) registerButton.style.display = "none";
	if (logoutButton) logoutButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";
	if (WinnerScreen) WinnerScreen.style.display = "none";
	if (message) message.style.display = "none";
	if (matchHistory) matchHistory.style.display = "none";
	if (tournamentRegistrationModal) tournamentRegistrationModal.style.display = "none";
	if (tournamentResults) tournamentResults.style.display = "none";
	if (tournamentFinishContinue) tournamentFinishContinue.style.display = "none";
	if (tournamentResetButton) tournamentResetButton.style.display = "none";
	if (generalLoginModal) generalLoginModal.style.display = "none";
	if (generalRegistrationModal) generalRegistrationModal.style.display = "none";
	if (settings) settings.style.display = "none";
	if (friendStuff) friendStuff.style.display = "none";
	if (addFriend) addFriend.style.display = "none";
	if (twoPlayerMatchContainer) twoPlayerMatchContainer.style.display = "none";
	if (twoPlayerMatchLogin) twoPlayerMatchLogin.style.display = "none";
	if (twoPlayerMatchInviteForm) twoPlayerMatchInviteForm.style.display = "none";
	if (multiplayerMatchInviteContainer) multiplayerMatchInviteContainer.style.display = "none";
	if (multiplayerMatchInviteForm1) multiplayerMatchInviteForm1.style.display = "none";
	if (multiplayerMatchInviteForm2) multiplayerMatchInviteForm2.style.display = "none";
	if (multiplayerMatchInviteForm3) multiplayerMatchInviteForm3.style.display = "none";
}