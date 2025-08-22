import { GameInfo, pageIndex } from "./frontendStructures.js";
import { callSettingsEventlisteners } from "./settings.js";
import { callRegistrationEventListeners } from "./registration.js";
import { callLoginEventListeners } from "./login.js";
import { callTournamentEventListeners } from "./tournamentRegistration.js";
import { callLogoutEventListeners } from "./logout.js";
import { callHTMLclassDefines } from "./html_classes.js";
export let rounds = 1;

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

	keysPressed[e.key] = true;
}

export function handleKeyup(e: KeyboardEvent): void {
	keysPressed[e.key] = false;
}

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

callHTMLclassDefines();
callGameEventListeners(game);

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

const render = (view: string) => {
	console.log("loading" + view + "...");
};

export const navigate = (view: string) => {
  history.pushState({ view }, '', `#${view}`);
  render(view);
};

// document.getElementById('loginButton')!.addEventListener('click', () => navigate('login'));
// document.getElementById('registerButton')!.addEventListener('click', () => navigate('register'));
// document.getElementById('playSelect')!.addEventListener('change', () => navigate('play'));

// Handle browser back/forward
window.addEventListener('hashchange', () => {
  const view = location.hash.replace('#', '') || game.availablePages[pageIndex.HOME];
  render(view);
});

// Initial load
window.addEventListener('load', () => {
  const view = location.hash.replace('#', '') || game.availablePages[pageIndex.HOME];
  render(view);
});

import { callGameEventListeners, clickWinnerScreenContinue, updateGame } from "./gamePlay.js";
import { callTwoPlayerMatchEventListeners } from "./twoPlayerMatch_local.js";
clickWinnerScreenContinue();
updateGame();
