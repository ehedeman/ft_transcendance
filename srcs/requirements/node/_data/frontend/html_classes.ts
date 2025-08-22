
export function callHTMLclassDefines()
{
	customElements.define('settings-components', htmlSettings);
	customElements.define('registration-components', htmlRegistration);
	customElements.define('login-components', htmlLogin);
	customElements.define('tournament-components', htmlTournament);
	customElements.define('friend-components', htmlFriends);
	customElements.define('two-player-match', htmlTwoPlayerMatch);
}

class htmlTournament extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="tournamentRegistrationModal" style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:white; padding:20px; border-radius:8px; z-index:10; width: 300px;">
				<div style="display:flex; flex-direction:column; height:100%;">
					<h2 id="tournamentRegisterHeader">Register Tournament Players</h2>
					<form id="tournamentRegistrationForm" style="flex-grow:1; display:flex; flex-direction:column; justify-content:space-between;">
						<div>
							<input type="text" id="tournamentUsername" name="username" placeholder="Username" required />
							<input type="password" id="tournamentPassword" name="password" placeholder="Password" required />
						</div>
						<div style="margin-top:20px;">
							<button type="button" id="showTournamentPassword" class="bg-blue-500 text-white px-4 py-2 rounded">Show Password</button>
							<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Continue</button>
							<button type="button" id="CancelGeneralTournament" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
						</div>
					</form>
				</div>
			</div>

			<div id="tournamentResults" style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:white; padding:20px; border-radius:8px; z-index:10;">
				<h2>Tournament Results</h2>
				<ol id="placementList"></ol>
			</div>

			<button id="tournamentFinishContinue" style="display:none; position:absolute; z-index:2; left:50%; top:10%; transform:translateX(-50%);" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Continue</button>
			<button id="tournamentResetButton" style="display:none; position:absolute; z-index:2; left:50%; top:70px; transform:translateX(-50%);" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">Reset Tournament</button>
		`;
	}
}

class htmlLogin extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="generalLoginModal"
				style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:white; padding:20px; border-radius:8px; z-index:10; width:300px;">
				<div style="display:flex; flex-direction:column; height:100%;">
					<h2>
						Login
					</h2>
					<form id="generalLoginForm" method="post"
						style="flex-grow:1; display:flex; flex-direction:column; justify-content:space-between;">
						<div>
							<input type="text" id="loginUsername" name="username" placeholder="Username" required="true" />
							<input type="password" id="loginPassword" name="password" placeholder="Password"
								required="true" />
						</div>
						<div style="margin-top:20px;">
							<button type="button" id="showLoginPassword"
								class="bg-blue-500 text-white px-4 py-2 rounded">Show Password</button>
							<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Continue</button>
							<button type="button" id="CancelGeneralLogin"
								class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}
}

export class htmlRegistration extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="generalRegistrationModal"
				style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:white; padding:20px; border-radius:8px; z-index:10; width:300px;">
				<div>
					<h2>
						Register
					</h2>
					<form id="generalRegistrationForm" method="post"
						style="flex-grow:1; display:flex; flex-direction:column; justify-content:space-between;">
						<div>
							<input type="text" id="registerName" name="name" placeholder="Name" required="true" />
							<input type="text" id="registerUsername" name="username" placeholder="Username"
								required="true" />
							<input type="password" id="registerPassword" name="password" placeholder="Password"
								required="true" />
							<input type="country" id="registerCountry" name="country" placeholder="Country"
								required="true" />
							<div>
								<label for="registerAvatar" style="cursor:pointer;">
									<img id="registerAvatarImg" src="./avatars/default-avatar.png"
										style="width:64px; height:64px; border-radius:8px; border:2px solid #aaa;"
										alt="Select your avatar" />
								</label>
								<input type=" file" id="registerAvatar" name="avatar" accept="image/*"
									style="display:none;" />
								<img id="avatarPreview" src="./avatars/default-avatar.png"
									style="width:64px; height:64px; display:none;" />
							</div>
						</div>
						<div style="margin-top:20px;">
							<button type="button" id="showRegisterPassword"
								class="bg-blue-500 text-white px-4 py-2 rounded">Show Password</button>
							<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Continue</button>
							<button type="button" id="generalCancelRegistration"
								class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		`;
	}
}


export class htmlSettings extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="settings" style="display:none; position:absolute; flex-grow:1; display:none; flex-direction:column; top:20%; left:50%; transform:translateX(-50%); background:white; padding:20px; border-radius:8px; z-index:10; width: 300px;">
			<div style="display:flex; flex-direction:column;  justify-content:space-between; align-items:center; height:100%;">
				<h2 id="settingsHeader"></h2>
				<form id="settingsForm" method="post" style="flex-grow:1; display:flex; flex-direction:column; margin-bottom:10px; justify-content:space-between; align-items:center;">
					<input type="text" id="settingsName" name="name" required="false" />
					<input type="text" id="settingsUsername" name="username" required="false" />
					<input type="password" id="settingsPassword" name="password" />
					<input type="text" id="settingsCountry" name="country" required="false" />

					<div id="avatarContainer" style="text-align:center; margin-bottom:10px; margin-top:10px;">
						<img id="avatarPreviewSettings" src="./avatars/default-avatar.png" alt="Avatar" style="width:100px; height:100px; border-radius:50%; cursor:pointer;" />
						<input type="file" id="avatarUpload" name="avatar" accept="image/*" style="display:none;" />
					</div>
					<div style="display: flex; gap: 10px;">
						<button style="flex: 1;" type="button" id="showSettingsPassword" class="bg-blue-500 text-white px-4 py-2 rounded">Show Password</button>
						<button style="flex: 1;" type="submit" id="settingsSave" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
						<button style="flex: 1;" type="button" id="settingsDeleteAccount" class="bg-blue-500 text-white px-4 py-2 rounded">Delete Account</button>
					</div>
				</form>
				<form id="settingsLogin" method="post" style="flex-grow:1; display:flex; flex-direction:column; margin-bottom:10px; justify-content:space-between;">
					<input type="text" id="settingsLoginUsername" name="username" placeholder="Username" required="true" />
					<input type="password" id="settingsLoginPassword" name="password" placeholder="Password" required="true" />
					<button type="submit" id="settingsLoginSubmit" class="bg-blue-500 text-white px-4 py-2 rounded">Log In</button>
				</form>
				<button style="flex-grow:1; gap: 10px;" type="button" id="settingsCancel" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
			</div>
		</div>
		`;
	}
}

export class htmlFriends extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="friendStuff" style="display: none;">
			<div style="position:absolute; top: calc(120px + 620px)">
				<header style="position:absolute;">Friends</header>
			</div>
			<div style="position: absolute; flex-direction: row; top: calc(120px + 620px + 20px); left: 50%; transform: translateX(-50%);">
				<div style="display: flex; gap: 20px;">
					<ul id="friendList" style="width: 200px; height: 75px; overflow-y: auto; padding-left: 20px; border: 1px solid #000000;">
						<li>Please login to see friends</li>
					</ul>
					<ul id="friendList2" style="width: 200px; height: 75px; overflow-y: auto; padding-left: 20px; border: 1px solid #000000;">
						<li>Please click a friend to see the history...</li>
					</ul>
					<ul style="padding-left: 20px; max-width: 75px; max-height: 65px;">
						<button style="width: 75px; height: 75px; display: none;" id="addFriend" class="bg-blue-500 text-white px-4 py-2 rounded">Add Friend</button>
					</ul>
					<ul id="friendRequestsList" style="width: 250px; height: 75px; overflow-y: auto; padding-left: 20px; border: 1px solid #000000;">
						<li>Your new friend requests will appear here</li>
					</ul>
				</div>
			</div>
		</div>
		`;
	}
}


export class htmlTwoPlayerMatch extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="twoPlayerMatchContainer" style="display: none; position:absolute; top:30%; left:50%; transform:translateX(-50%); background:white; padding:20px; border-radius:8px; z-index:10;">
			<h1 id="twoPlayerMatchHeader">Please chose a Game-Mode.</h1>
			<select id="twoPlayerMatchSelect" style="position:absolute; display: block; z-index: 2; left: 75%; top: 70px; transform: translateX(-50%);">
				<option value="" disabled selected>GameMode</option>
				<option value="local">Local</option>
				<option value="remote">Remote</option>
			</select>
			<button id="twoPlayerMatchGuestGame" style="flex-grow:1; gap: 10px; display: none;" type="button" class="bg-blue-500 text-white px-4 py-2 rounded">Guest vs. Player Match</button>
			<button id="twoPlayerMatchPlayerGame" style="flex-grow:1; gap: 10px; display: none;" type="button" class="bg-blue-500 text-white px-4 py-2 rounded">Player vs. Player Match</button>
			<form id="twoPlayerMatchLogin" method="post" style="flex-grow:1; display:none; flex-direction:column; margin-bottom:10px; justify-content:space-between;">
				<h2 id="twoPlayerMatchLoginHeader">Login</h1>
				<input type="text" id="twoPlayerMatchUsername" name="username" placeholder="Username" required="true" />
				<input type="password" id="twoPlayerMatchPassword" name="password" placeholder="Password" required="true" />
				<button type="submit" id="twoPlayerMatchLoginSubmit" class="bg-blue-500 text-white px-4 py-2 rounded">Log In</button>
			</form>
			<button style="flex-grow:1; gap: 10px;" type="button" id="twoPlayerMatchCancel" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>			
		</div>
		`;
	}
}