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

	//if (leaveGameButton) leaveGameButton.classList.add("hidden");
	if (messages) messages.classList.add("hidden");
	if (logoutButton) logoutButton.classList.add("hidden");
	if (preview) preview.src = "./avatars/default-avatar.png";
	if (registerButton) registerButton.classList.remove("hidden");
	if (playSelect) playSelect.classList.add("hidden");
	if (loginButton) loginButton.classList.remove("hidden");
	if (registerModal) registerModal.classList.add("hidden");
	if (settings) settings.classList.add("hidden");
	if (loginModal) loginModal.classList.add("hidden");
	if (settingsButton) settingsButton.classList.add("hidden");
	if (friendStuff) friendStuff.classList.add("hidden");
	if (matchHistory) matchHistory.classList.add("hidden");
	if (dashboardButton) dashboardButton.classList.add("hidden");
	if (dashboardView) dashboardView.classList.add("hidden");
	if (globalDashboardButton) globalDashboardButton.classList.add("hidden");
	if (globalDashboardView) globalDashboardView.classList.add("hidden");
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

	if (messages) messages.classList.add("hidden");
	if (logoutButton) logoutButton.classList.add("hidden");
	if (registerButton) registerButton.classList.add("hidden");
	if (playSelect) playSelect.classList.add("hidden");
	if (loginButton) loginButton.classList.add("hidden");
	if (registerModal) registerModal.classList.add("hidden");
	if (settings) settings.classList.add("hidden");
	if (loginModal) loginModal.classList.add("hidden");
	if (settingsButton) settingsButton.classList.add("hidden");
	if (friendStuff) friendStuff.classList.add("hidden");
	if (matchHistory) matchHistory.classList.add("hidden");
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

	if (messages) messages.classList.remove("hidden");
	if (logoutButton) logoutButton.classList.remove("hidden");
	if (registerButton) registerButton.classList.add("hidden");
	if (friendStuff) friendStuff.classList.remove("hidden");
	if (settingsButton) settingsButton.classList.remove("hidden");
	if (playSelect) playSelect.classList.remove("hidden");
	if (loginButton) loginButton.classList.add("hidden");
	if (settings) settings.classList.add("hidden");
	if (loginModal) loginModal.classList.add("hidden");
	if (registerModal) registerModal.classList.add("hidden");
	if (preview) preview.src = "./avatars/default-avatar.png";
	if (matchHistory) matchHistory.classList.remove("hidden");
	if (addFriend) addFriend.classList.remove("hidden");
	if (dashboardButton) dashboardButton.classList.remove("hidden");
	if (globalDashboardButton) globalDashboardButton.classList.remove("hidden");

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
	const dashboardButton = document.getElementById("dashboardButton");
	const dashboardView = document.getElementById("dashboardView");
	const globalDashboardButton = document.getElementById("globalDashboardButton");
	const globalDashboardView = document.getElementById("globalDashboardView");
	//const leaveGameButton = document.getElementById("leaveGameButton");
	//if (leaveGameButton) leaveGameButton.classList.add("hidden");
	if (dashboardButton) dashboardButton.classList.add("hidden");
	if (dashboardView) dashboardView.classList.add("hidden");
	if (globalDashboardButton) globalDashboardButton.classList.add("hidden");
	if (globalDashboardView) globalDashboardView.classList.add("hidden");
	if (registerButton) registerButton.classList.add("hidden");
	if (logoutButton) logoutButton.classList.add("hidden");
	if (playSelect) playSelect.classList.add("hidden");
	if (loginButton) loginButton.classList.add("hidden");
	if (WinnerScreen) WinnerScreen.classList.add("hidden");
	if (message) message.classList.add("hidden");
	if (matchHistory) matchHistory.classList.add("hidden");
	if (tournamentRegistrationModal) tournamentRegistrationModal.classList.add("hidden");
	if (tournamentResults) tournamentResults.classList.add("hidden");
	if (tournamentFinishContinue) tournamentFinishContinue.classList.add("hidden");
	if (tournamentResetButton) tournamentResetButton.classList.add("hidden");
	if (generalLoginModal) generalLoginModal.classList.add("hidden");
	if (generalRegistrationModal) generalRegistrationModal.classList.add("hidden");
	if (settings) settings.classList.add("hidden");
	if (friendStuff) friendStuff.classList.add("hidden");
	if (addFriend) addFriend.classList.add("hidden");
	if (twoPlayerMatchContainer) twoPlayerMatchContainer.classList.add("hidden");
	if (twoPlayerMatchLogin) twoPlayerMatchLogin.classList.add("hidden");
	if (twoPlayerMatchInviteForm) twoPlayerMatchInviteForm.classList.add("hidden");
	if (multiplayerMatchInviteContainer) multiplayerMatchInviteContainer.classList.add("hidden");
	if (multiplayerMatchInviteForm1) multiplayerMatchInviteForm1.classList.add("hidden");
	if (multiplayerMatchInviteForm2) multiplayerMatchInviteForm2.classList.add("hidden");
	if (multiplayerMatchInviteForm3) multiplayerMatchInviteForm3.classList.add("hidden");
}