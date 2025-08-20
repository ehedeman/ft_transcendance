import { GameInfo } from "./frontendStructures.js";
import { callSettingsEventlisteners } from "./settings.js";
import { callRegistrationEventListeners } from "./registration.js";
import { callLoginEventListeners } from "./login.js";
import { callTournamentEventListeners } from "./tournamentRegistration.js";
import { callLogoutEventListeners } from "./logout.js";
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

export let gamefinished = false;



/*-------------------------------------settings------------------------------------*/

callSettingsEventlisteners();

/*--------------------------registration modal declaration--------------------------*/

callRegistrationEventListeners();

/*-----------------------------login modal declaration------------------------------*/

callLoginEventListeners(game);

/*-----------------------------logout modal declaration------------------------------*/

callLogoutEventListeners(game);

/*--------------------------tournament modal declaration----------------------------*/

callTournamentEventListeners(game);


import { clickWinnerScreenContinue, updateGame } from "./gamePlay.js";
clickWinnerScreenContinue();
updateGame();
