import { GameInfo, gameSnapShot, pageIndex } from "./frontendStructures.js";
import { navigate } from "./index.js";
import { showGeneralLoginModal } from "./login.js";
import { showGeneralRegistrationModal } from "./registration.js";
import { hideDefaultButtons, restoreScreen, restoreScreenLoggedIn } from "./screenDisplay.js";
import { settingsStart, showSettings } from "./settings.js";
import { tournamentStart } from "./tournament.js";
import { twoPlayerMatchStart } from "./twoPlayerMatch_local.js";
import { multiplayerGameStart } from "./multiplayerGame.js";

function mimicRegistration()
{
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";
	showGeneralRegistrationModal();
}

function mimicLogin(game: GameInfo)
{
	const registerButton = document.getElementById("registerButton");
	const playSelect = document.getElementById("playSelect");
	const loginButton = document.getElementById("loginButton");
	if (registerButton) registerButton.style.display = "none";
	if (playSelect) playSelect.style.display = "none";
	if (loginButton) loginButton.style.display = "none";

	showGeneralLoginModal(game);
}

export const render = (view: string, state: any, game:GameInfo) => {
	console.log("loading" + view + "...");
	restoreScreen(game);
	
	var stateTest = state?.view || null;
	if (stateTest)
	{
		var data;
		if (state && state.snapShot && state.snapShot.players)
		{
			data = {
				view: state.view,
				info: state.info,
				gameState: state.snapShot
			}
			game.players = data.gameState.players;
			game.currentlyLoggedIn = data.gameState.currentlyLoggedIn;
		}
		console.log(data?.info);
		switch (view) {
			case game.availablePages[pageIndex.HOME]:
				if (data && data.info === "loggedIn")
					restoreScreenLoggedIn();
				else
					restoreScreen(game);
				break;
			case game.availablePages[pageIndex.REGISTER]:
				mimicRegistration();
				break;
			case game.availablePages[pageIndex.LOGIN]:
				mimicLogin(game);
				break;
			case game.availablePages[pageIndex.SETTINGS]:
				settingsStart(game)
				break;
			case game.availablePages[pageIndex.TOURNAMENT]:
				tournamentStart(game);
				break;
			case game.availablePages[pageIndex.MATCH]:
				twoPlayerMatchStart(game);
				break;
			case game.availablePages[pageIndex.MULTIPLAYER]:
				multiplayerGameStart(game);
				break;
			default:
				break;
		}
	}
	else
		restoreScreen(game);
};