export function emptyLoginFields(loginType: string): void {
	switch (loginType) {
		case "loginTournament":
			const tournamentPassword = document.getElementById("tournamentPassword") as HTMLInputElement;
			const tournamentUsername = document.getElementById("tournamentUsername") as HTMLInputElement;
			if (tournamentUsername) tournamentUsername.value = "";
			if (tournamentPassword) tournamentPassword.value = "";
			break;
		case "loginGeneral":
			const loginPassword = document.getElementById("loginPassword") as HTMLInputElement;
			const loginUsername = document.getElementById("loginUsername") as HTMLInputElement;
			if (loginUsername) loginUsername.value = "";
			if (loginPassword) loginPassword.value = "";
			break;
		case "loginSettings":
			const settingPassword = document.getElementById("settingsLoginPassword") as HTMLInputElement;
			const settingUsername = document.getElementById("settingsLoginUsername") as HTMLInputElement;
			if (settingUsername) settingUsername.value = "";
			if (settingPassword) settingPassword.value = "";
			break;
		case "registerSettings":
			const registerPassword = document.getElementById("registerPassword") as HTMLInputElement;
			const registerUsername = document.getElementById("registerUsername") as HTMLInputElement;
			if (registerUsername) registerUsername.value = "";
			if (registerPassword) registerPassword.value = "";
			break;
		default:
			break;
	}
}