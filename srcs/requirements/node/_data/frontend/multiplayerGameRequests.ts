import { GameInfo } from "./frontendStructures.js";
import { hideDefaultButtons, hideEverything, restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";

function showSubmitForm() {
	hideDefaultButtons();
	const container = document.getElementById("multiplayerMatchInviteContainer");
	if (container) container.classList.remove("hidden");
	const form = document.getElementById("multiplayerMatchInviteForm1");
	if (form) form.classList.remove("hidden");
}

function hideSubmitForm() {
	const container = document.getElementById("multiplayerMatchInviteContainer");
	if (container) container.classList.add("hidden");
	const form1 = document.getElementById("multiplayerMatchInviteForm1");
	if (form1) form1.classList.add("hidden");
	const form2 = document.getElementById("multiplayerMatchInviteForm2");
	if (form2) form2.classList.add("hidden");
	const form3 = document.getElementById("multiplayerMatchInviteForm3");
	if (form3) form3.classList.add("hidden");
	const input1 = document.getElementById("inputMultiplayerUsername1") as HTMLInputElement;
	if (input1) input1.value = "";
	const input2 = document.getElementById("inputMultiplayerUsername2") as HTMLInputElement;
	if (input2) input2.value = "";
	const input3 = document.getElementById("inputMultiplayerUsername3") as HTMLInputElement;
	if (input3) input3.value = "";
	restoreScreenLoggedIn();
}

function subscribeToFormEvents(game: GameInfo) {
	const form1 = document.getElementById("multiplayerMatchInviteForm1");
	const form2 = document.getElementById("multiplayerMatchInviteForm2");
	const form3 = document.getElementById("multiplayerMatchInviteForm3");
	game.multiplayerName.splice(0, game.multiplayerName.length);
	if (form1) {
		form1.onsubmit = event => {
			event.preventDefault();
			const input = document.getElementById("inputMultiplayerUsername1") as HTMLInputElement;
			const username = input.value;
			if (username === game.currentlyLoggedIn.name) {
				alert("You cannot invite yourself");
				hideSubmitForm();
				return;
			}
			const form2 = document.getElementById("multiplayerMatchInviteForm2");
			if (form2) form2.classList.remove("hidden");
			const form1 = document.getElementById("multiplayerMatchInviteForm1");
			if (form1) form1.classList.add("hidden");
			fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
				.then(response => {
					if (!response.ok) {
						alert("Failed to start multiplayer game");
						hideSubmitForm();
						return;
					}
					const input1 = document.getElementById("inputMultiplayerUsername1") as HTMLInputElement;
					input1.value = "";
					game.multiplayerName.push(username);
				});
		}
	}
	if (form2) {
		form2.onsubmit = event => {
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
			const form3 = document.getElementById("multiplayerMatchInviteForm3");
			if (form3) form3.classList.remove("hidden");
			const form2 = document.getElementById("multiplayerMatchInviteForm2");
			if (form2) form2.classList.add("hidden");
			fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
				.then(response => {
					if (!response.ok) {
						alert("Failed to start multiplayer game");
						hideSubmitForm();
						return;
					}
					const input2 = document.getElementById("inputMultiplayerUsername2") as HTMLInputElement;
					input2.value = "";
					game.multiplayerName.push(username);
				});
		}
	}
	if (form3) {
		form3.onsubmit = event => {
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
			hideSubmitForm();
			fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
				.then(response => {
					if (!response.ok) {
						alert("Failed to start multiplayer game");
						hideSubmitForm();
						return;
					}
					hideSubmitForm();
					const input3 = document.getElementById("inputMultiplayerUsername3") as HTMLInputElement;
					input3.value = "";
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
							game.multiplayerName.splice(0, game.multiplayerName.length);
						});
				});
		}
	}
	// document.getElementById("multiplayerMatchInviteForm1")?.addEventListener("submit", (event) => {
	// 	event.preventDefault();
	// 	const input = document.getElementById("inputMultiplayerUsername1") as HTMLInputElement;
	// 	const username = input.value;
	// 	if (username === game.currentlyLoggedIn.name) {
	// 		alert("You cannot invite yourself");
	// 		hideSubmitForm();
	// 		return;
	// 	}
	// 	const form2 = document.getElementById("multiplayerMatchInviteForm2");
	// 	if (form2) form2.classList.remove("hidden");
	// 	const form1 = document.getElementById("multiplayerMatchInviteForm1");
	// 	if (form1) form1.classList.add("hidden");
	// 	fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
	// 		.then(response => {
	// 			if (!response.ok) {
	// 				alert("Failed to start multiplayer game");
	// 				hideSubmitForm();
	// 				return;
	// 			}
	// 			const input1 = document.getElementById("inputMultiplayerUsername1") as HTMLInputElement;
	// 			input1.value = "";
	// 			game.multiplayerName.push(username);
	// 		});
	// });
	// document.getElementById("multiplayerMatchInviteForm2")?.addEventListener("submit", (event) => {
	// 	event.preventDefault();
	// 	const input = document.getElementById("inputMultiplayerUsername2") as HTMLInputElement;
	// 	const username = input.value;
	// 	if (username === game.currentlyLoggedIn.name) {
	// 		alert("You cannot invite yourself");
	// 		return;
	// 	}
	// 	if (game.multiplayerName.includes(username)) {
	// 		alert("User is already invited");
	// 		hideSubmitForm();
	// 		return;
	// 	}
	// 	const form3 = document.getElementById("multiplayerMatchInviteForm3");
	// 	if (form3) form3.classList.remove("hidden");
	// 	const form2 = document.getElementById("multiplayerMatchInviteForm2");
	// 	if (form2) form2.classList.add("hidden");
	// 	fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
	// 		.then(response => {
	// 			if (!response.ok) {
	// 				alert("Failed to start multiplayer game");
	// 				hideSubmitForm();
	// 				return;
	// 			}
	// 			const input2 = document.getElementById("inputMultiplayerUsername2") as HTMLInputElement;
	// 			input2.value = "";
	// 			game.multiplayerName.push(username);
	// 		});
	// });
	// document.getElementById("multiplayerMatchInviteForm3")?.addEventListener("submit", (event) => {
	// 	event.preventDefault();
	// 	const input = document.getElementById("inputMultiplayerUsername3") as HTMLInputElement;
	// 	const username = input.value;
	// 	if (username === game.currentlyLoggedIn.name) {
	// 		alert("You cannot invite yourself");
	// 		return;
	// 	}
	// 	if (game.multiplayerName.includes(username)) {
	// 		alert("User is already invited");
	// 		hideSubmitForm();
	// 		return;
	// 	}
	// 	hideSubmitForm();
	// 	fetch(`/multiplayer?invitedUser=${username}&username=${game.currentlyLoggedIn.name}`)
	// 		.then(response => {
	// 			if (!response.ok) {
	// 				alert("Failed to start multiplayer game");
	// 				hideSubmitForm();
	// 				return;
	// 			}
	// 			hideSubmitForm();
	// 			const input3 = document.getElementById("inputMultiplayerUsername3") as HTMLInputElement;
	// 			input3.value = "";
	// 			game.multiplayerMode = true;
	// 			game.multiplayerName.push(username);
	// 			fetch(`/multiplayerGameStart?username=${game.currentlyLoggedIn.name}
	// 										&opponent1=${game.multiplayerName[0]}
	// 										&opponent2=${game.multiplayerName[1]}
	// 										&opponent3=${game.multiplayerName[2]}`)
	// 				.then(response => {
	// 					if (!response.ok) {
	// 						alert("Failed to start multiplayer game");
	// 						restoreScreenLoggedIn();
	// 						return;
	// 					}
	// 					game.multiplayerName.splice(0, game.multiplayerName.length);
	// 				});
	// 		});
	// });
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