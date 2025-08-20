

export function restoreScreen(): void {
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	const registerModal = document.getElementById("generalRegistrationModal") as HTMLDivElement;
	const settings = document.getElementById("settings") as HTMLElement;
	const loginModal = document.getElementById("generalLoginModal") as HTMLDivElement;
	const preview = document.getElementById("registerAvatarImg") as HTMLImageElement;

	if (preview) preview.src = "avatars/default-avatar.png";
	if (registerButton) registerButton.style.display = "block";
	if (playSelect) playSelect.style.display = "block";
	if (loginButton) loginButton.style.display = "block";
	if (registerModal) registerModal.style.display = "none";
	if (settings) settings.style.display = "none";
	if (loginModal) loginModal.style.display = "none";
}