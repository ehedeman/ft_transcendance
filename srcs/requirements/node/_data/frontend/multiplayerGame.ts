import { GameInfo } from "./frontendStructures.js";
import { hideDefaultButtons, restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";

let count: number = 0;

function showSubmitForm() {
	hideDefaultButtons();
	const container = document.getElementById("multiplayerMatchInviteContainer");
	if (container) container.style.display = "block";
	const form = document.getElementById("multiplayerMatchInviteForm");
	if (form) form.style.display = "block";
}

function hideSubmitForm() {
	const container = document.getElementById("multiplayerMatchInviteContainer");
	if (container) container.style.display = "none";
	const form = document.getElementById("multiplayerMatchInviteForm");
	if (form) form.style.display = "none";
	count = 0;
	restoreScreenLoggedIn();
}

function subscribeToFormEvents(game: GameInfo) {
    document.getElementById("multiplayerMatchInviteForm")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("inputMultiplayerUsername") as HTMLInputElement;
        const username = input.value;
        fetch(`/multiplayer?username=${username}`)
            .then(response => {
                if (!response.ok) {
                    alert("Failed to start multiplayer game");
                    hideSubmitForm();
                    return;
                }
                if (count === 0) {
                    const header = document.getElementById("inviteMultiPlayerHeader"); // <-- FIXED
                    if (header) header.innerText = `Invite the second player.`;
                    input.value = "";
                    input.placeholder = "Enter second player's username";
                    count++;
                }
                if (count === 1) {
                    const header = document.getElementById("inviteMultiPlayerHeader"); // <-- FIXED
                    if (header) header.innerText = `Invite the third player.`;
                    input.value = "";
                    input.placeholder = "Enter third player's username";
                    count++;
                }
                if (count === 2) {
                    const header = document.getElementById("inviteMultiPlayerHeader"); // <-- FIXED
                    if (header) header.innerText = `Invite the first player.`;
                    input.value = "";
                    input.placeholder = "Enter first player's username";
                    count = 0;
                    hideSubmitForm();
                    game.multiplayerMode = true;
                }
            });
    });
    document.getElementById("cancelInvite")?.addEventListener("click", (event) => { // <-- FIXED
        event.preventDefault();
        hideSubmitForm();
    });
}

export function multiplayerGameStart(game: GameInfo) {
	showSubmitForm();
	subscribeToFormEvents(game);
}