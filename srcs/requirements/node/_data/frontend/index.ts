import { GameInfo, gameSnapShot, pageIndex, renderInfo } from "./frontendStructures.js";
import { callSettingsEventlisteners } from "./settings.js";
import { callRegistrationEventListeners } from "./registration.js";
import { callLoginEventListeners, getUserInfoAndCreateUserInterface, getUserMatchHistory } from "./login.js";
import { callTournamentEventListeners } from "./tournamentRegistration.js";
import { callLogoutEventListeners } from "./logout.js";
import { callHTMLclassDefines } from "./html_classes.js";
import { loadUserDashboard } from "./dashboard.js";
import { loadGlobalStats } from "./globalDashboard.js";
export let rounds = 3;

export let game = new GameInfo();

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = 900;
canvas.height = 600;
canvas.style.background = "black";


let canvas_focus: boolean = false;
canvas.addEventListener("click", () => canvas_focus = true);

document.addEventListener("click", (e: MouseEvent) => {
	if (e.target !== canvas) canvas_focus = false;
});

export const keysPressed: { [key: string]: boolean } = {};

export function handleKeydown(e: KeyboardEvent): void {
	if (e.key === " " && !canvas_focus) {
		fetch("/pressspace");
	}

	const scrollKeys: string[] = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
	if (scrollKeys.indexOf(e.key) !== -1) {
		e.preventDefault();
	}
	//block w/s keys for remote
	if (game.localMode || (e.key !== "w" && e.key !== "W" && e.key !== "S" && e.key !== "s"))
		keysPressed[e.key] = true;
}

export function handleKeyup(e: KeyboardEvent): void {
	keysPressed[e.key] = false;
}

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

//location.hash.replace('#', '') ||
const initialView = 'home';
history.replaceState({ view: initialView }, '', `#${initialView}`);
render(initialView, {
	view: "home",
	info: "",
	snapShot: { players: game.players, currentlyLoggedIn: game.currentlyLoggedIn },
}, game);


export const navigate = (view: string, infoString: string, game: GameInfo) => {
	var gameSnapShot_: gameSnapShot = { players: game.players, currentlyLoggedIn: game.currentlyLoggedIn };

	var renderInfo_: renderInfo = {
		view: view,
		info: infoString,
		snapShot: gameSnapShot_,
	}

	history.pushState({
		view: view, info: infoString, snapShot: gameSnapShot_
	}, '', `#${view}`);
	render(view, renderInfo_, game);
};

// Handle browser back/forward

window.addEventListener('popstate', (event) => {
	const state = event.state as renderInfo;
	if (state?.view) {
		render(state.view, state, game);
	} else {
		render('home', state, game); // fallback
	}
});


// Just added_pat...
const dashboardButton = document.getElementById("dashboardButton") as HTMLButtonElement;
dashboardButton.style.display = "block";

dashboardButton.addEventListener("click", () => {
	hideEverything();
	document.getElementById("dashboardButton")!.style.display = "block";
	document.getElementById("globalDashboardButton")!.style.display = "block";
	document.getElementById("dashboardView")!.style.display = "block";
	const alias = game.currentlyLoggedIn.name; // your logged-in user alias
	loadUserDashboard(alias);
});

document.getElementById("closeDashboard")!.addEventListener("click", () => {
	document.getElementById("dashboardView")!.style.display = "none";
	restoreScreenLoggedIn();
});
// ..............added


// added.....................

const globalButton = document.getElementById("globalDashboardButton") as HTMLButtonElement;
const globalView = document.getElementById("globalDashboardView") as HTMLDivElement;
const globalClose = document.getElementById("closeGlobalDashboard") as HTMLButtonElement;

globalButton.addEventListener("click", () => {
	hideEverything();
	document.getElementById("dashboardButton")!.style.display = "block";
	document.getElementById("globalDashboardButton")!.style.display = "block";
	globalView.style.display = "block";
	loadGlobalStats();
});

globalClose.addEventListener("click", () => {
	globalView.");
	restoreScreenLoggedIn();
});

// added.......

// Initial load
window.onpopstate = (event: PopStateEvent) => {
	const state = event.state as renderInfo;
	const view = state?.view || 'home';
	render(view, state, game);
};

callHTMLclassDefines();
callGameEventListeners(game);

//only works for local so far
// document.getElementById("leaveGameButton")?.addEventListener("click", () => {

// 	emptyLoginFields("twoPlayerMatch");
// 	game.players.splice(0, game.players.length);
// 	navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
// 	fetch("/leaveGamePressed");
// });
/*-------------------------------------settings------------------------------------*/

callSettingsEventlisteners(game);

/*--------------------------registration modal declaration--------------------------*/


callRegistrationEventListeners(game);

/*-----------------------------login modal declaration------------------------------*/


callLoginEventListeners(game);

/*-----------------------------logout modal declaration------------------------------*/

callLogoutEventListeners(game);

/*--------------------------tournament modal declaration----------------------------*/


callTournamentEventListeners(game);

callTwoPlayerMatchEventListeners(game);

import { callGameEventListeners, clickWinnerScreenContinue } from "./gamePlay.js";
import { callTwoPlayerMatchEventListeners, restoreMatchState } from "./twoPlayerMatch_local.js";
import { render } from "./page_render.js";
clickWinnerScreenContinue(game);
import { createWebSocketConnection } from "./websocketConnection.js";
import { getFriendList, getFriendRequestList, getRejectedFriendRequests } from "./friendSystemFunctions.js";
import { emptyLoginFields } from "./inputFieldHandling.js";
import { tournamentEnd } from "./tournament.js";
import { hideEverything, restoreScreenLoggedIn } from "./screenDisplay.js";

window.onload = function () {
	fetch("/endTournament");	// to make sure if tournament has been running its turned off now
	fetch("/keepLogin")
		.then(response => {
			if (!response.ok) {
				navigate(game.availablePages[pageIndex.HOME], "", game);
				return;
			}
			return response.json();
		})
		.then(data => {
			if (!data || !data.username) {
				navigate(game.availablePages[pageIndex.HOME], "", game);
				return;
			}
			createWebSocketConnection(data.username);
			// get the friend list
			getFriendList(data.username);
			getFriendRequestList(data.username);
			const addFriend = document.getElementById("addFriend") as HTMLElement;
			if (addFriend) addFriend.style.display = "block";
			getRejectedFriendRequests(data.username);
			getUserInfoAndCreateUserInterface(data.username);
			getUserMatchHistory(data.username);
			game.currentlyLoggedIn.name = data.username;
			game.currentlyLoggedIn.gamesLost = 0;
			game.currentlyLoggedIn.gamesWon = 0;
			game.currentlyLoggedIn.playerscore = 0;
			// restoreScreenLoggedIn();
			navigate(game.availablePages[pageIndex.HOME], "loggedIn", game);
		});
}
