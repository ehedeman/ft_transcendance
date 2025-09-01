import { GameInfo } from "./frontendStructures.js";
import { hideDefaultButtons, hideEverything, restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";

function showSubmitForm() {
	hideDefaultButtons();
	const container = document.getElementById("multiplayerMatchInviteContainer");
	if (container) container.style.display = "block";
	const form = document.getElementById("multiplayerMatchInviteForm1");
	if (form) form.style.display = "block";
}

function hideSubmitForm() {
	const container = document.getElementById("multiplayerMatchInviteContainer");
	if (container) container.style.display = "none";
	const form1 = document.getElementById("multiplayerMatchInviteForm1");
	if (form1) form1.style.display = "none";
	const form2 = document.getElementById("multiplayerMatchInviteForm2");
	if (form2) form2.style.display = "none";
	const form3 = document.getElementById("multiplayerMatchInviteForm3");
	if (form3) form3.style.display = "none";
	restoreScreenLoggedIn();
}

function subscribeToFormEvents(game: GameInfo) {
	document.getElementById("multiplayerMatchInviteForm1")?.addEventListener("submit", (event) => {
		event.preventDefault();
		const input = document.getElementById("inputMultiplayerUsername1") as HTMLInputElement;
		const username = input.value;
		if (username === game.currentlyLoggedIn.name) {
			alert("You cannot invite yourself");
			hideSubmitForm();
			return;
		}
		fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
			.then(response => {
				if (!response.ok) {
					alert("Failed to start multiplayer game");
					hideSubmitForm();
					return;
				}
				const form2 = document.getElementById("multiplayerMatchInviteForm2");
				if (form2) form2.style.display = "block";
				const form1 = document.getElementById("multiplayerMatchInviteForm1");
				if (form1) form1.style.display = "none";
				game.multiplayerName.push(username);
			});
	});
	document.getElementById("multiplayerMatchInviteForm2")?.addEventListener("submit", (event) => {
		event.preventDefault();
		const input = document.getElementById("inputMultiplayerUsername2") as HTMLInputElement;
		const username = input.value;
		if (username === game.currentlyLoggedIn.name) {
			alert("You cannot invite yourself");
			return;
		}
		if (game.multiplayerName.includes(username)) {
			alert("User is already invited");
			hideSubmitForm();
			return;
		}
		fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
			.then(response => {
				if (!response.ok) {
					alert("Failed to start multiplayer game");
					hideSubmitForm();
					return;
				}
				const form3 = document.getElementById("multiplayerMatchInviteForm3");
				if (form3) form3.style.display = "block";
				const form2 = document.getElementById("multiplayerMatchInviteForm2");
				if (form2) form2.style.display = "none";
				game.multiplayerName.push(username);
			});
	});
	document.getElementById("multiplayerMatchInviteForm3")?.addEventListener("submit", (event) => {
		event.preventDefault();
		const input = document.getElementById("inputMultiplayerUsername3") as HTMLInputElement;
		const username = input.value;
		if (username === game.currentlyLoggedIn.name) {
			alert("You cannot invite yourself");
			return;
		}
		if (game.multiplayerName.includes(username)) {
			alert("User is already invited");
			hideSubmitForm();
			return;
		}
		fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
			.then(response => {
				if (!response.ok) {
					alert("Failed to start multiplayer game");
					hideSubmitForm();
					return;
				}
				hideSubmitForm();
				game.multiplayerMode = true;
				game.multiplayerName.push(username);
				fetch(`/multiplayerGameStart?username=${game.currentlyLoggedIn.name}
											&opponent1=${game.multiplayerName[0]}
											&opponent2=${game.multiplayerName[1]}
											&opponent3=${game.multiplayerName[2]}`)
											.then(response => {
												if (!response.ok) {
													alert("Failed to start multiplayer game");
													restoreScreenLoggedIn();
													return;
												}
											});
			});
	});
	document.getElementById("cancelInvite1")?.addEventListener("click", (event) => {
		event.preventDefault();
		hideSubmitForm();
	});
	document.getElementById("cancelInvite2")?.addEventListener("click", (event) => {
		event.preventDefault();
		hideSubmitForm();
	});
	document.getElementById("cancelInvite3")?.addEventListener("click", (event) => {
		event.preventDefault();
		hideSubmitForm();
	});
}

export function multiplayerGameStart(game: GameInfo) {
	hideEverything();
	showSubmitForm();
	subscribeToFormEvents(game);
}