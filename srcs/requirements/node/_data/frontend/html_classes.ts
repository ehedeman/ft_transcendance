
export function callHTMLclassDefines() {
	customElements.define('settings-components', htmlSettings);
	customElements.define('registration-components', htmlRegistration);
	customElements.define('login-components', htmlLogin);
	customElements.define('tournament-components', htmlTournament);
	customElements.define('friend-components', htmlFriends);
	customElements.define('two-player-match', htmlTwoPlayerMatch);
	customElements.define('multiplayer-match', htmlMultiplayerMatch);
}

class htmlTournament extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="tournamentRegistrationModal" style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; width: 380px; color: #2c3e50; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
				<div style="display:flex; flex-direction:column; height:100%;">
					<h2 id="tournamentRegisterHeader" style="color: #2c3e50; font-size: 28px; margin-bottom: 20px; text-align: center; font-weight: 700;">Tournament Registration</h2>
					<form id="tournamentRegistrationForm" style="flex-grow:1; display:flex; flex-direction:column; gap: 20px;">
						<div style="display: flex; flex-direction: column; gap: 15px;">
							<input type="text" id="tournamentUsername" name="username" placeholder="Username" required 
								style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
							<input type="password" id="tournamentPassword" name="password" placeholder="Password" required 
								style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
						</div>
						<div style="display: flex; flex-direction: column; gap: 10px;">
							<button type="submit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Continue</button>
							<div style="display: flex; gap: 10px; justify-content: space-between;">
								<button type="button" id="showTournamentPassword" class="nav-button text-white px-4 py-2 rounded" style="flex: 1;">Show Password</button>
								<button type="button" id="CancelGeneralTournament" class="cancel-button px-4 py-2 rounded" style="flex: 1;">Cancel</button>
							</div>
						</div>
					</form>
				</div>
			</div>

			<div id="tournamentResults" style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
				<h2 style="color: #2c3e50; font-size: 28px; margin-bottom: 20px; text-align: center; font-weight: 700;">Tournament Results</h2>
				<div style="background: rgba(0,0,0,0.05); border-radius: 8px; padding: 15px;">
					<ol id="placementList" style="color: #2c3e50; font-size: 18px; padding-left: 30px;"></ol>
				</div>
			</div>

			<button id="tournamentFinishContinue" style="display:none; position:absolute; z-index:2; left:50%; top:10%; transform:translateX(-50%);" class="action-button text-white px-6 py-3 rounded" style="font-size: 16px;">Continue</button>
			<button id="tournamentResetButton" style="display:none; position:absolute; z-index:2; left:50%; top:70px; transform:translateX(-50%);" 
				style="background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%); border: none; font-weight: 600; color: white; padding: 10px 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;">Reset Tournament</button>
		`;
	}
}

class htmlLogin extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div id="generalLoginModal"
				style="display:none; position:absolute; top:20%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
				<div style="display:flex; flex-direction:column; height:100%;">
					<h2 style="color: #2c3e50; font-size: 28px; margin-bottom: 20px; text-align: center; font-weight: 700;">
						Login
					</h2>
					<form id="generalLoginForm" method="post"
						style="flex-grow:1; display:flex; flex-direction:column; justify-content:space-between; color: #2c3e50;">
						<div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
							<input type="text" id="loginUsername" name="username" placeholder="Alias" required="true" 
								style="padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
							<input type="password" id="loginPassword" name="password" placeholder="Password" required="true" 
								style="padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
						</div>
						<div style="display: flex; flex-direction: column; gap: 10px;">
							<button type="submit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Continue</button>
							<div style="display: flex; gap: 10px; justify-content: space-between;">
								<button type="button" id="showLoginPassword"
									class="nav-button text-white px-4 py-2 rounded" style="flex: 1;">Show Password</button>
								<button type="button" id="CancelGeneralLogin"
									class="cancel-button px-4 py-2 rounded" style="flex: 1;">Cancel</button>
							</div>
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
				style="display:none; position:absolute; top:10%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
				<div>
					<h2 style="color: #2c3e50; font-size: 28px; margin-bottom: 20px; text-align: center; font-weight: 700;">
						Register
					</h2>
					<form id="generalRegistrationForm" method="post"
						style="flex-grow:1; display:flex; flex-direction:column; justify-content:space-between; color: #2c3e50;">
						<div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
							<input type="text" id="registerName" name="name" placeholder="Alias" required="true" 
								style="padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
							<input type="text" id="registerUsername" name="username" placeholder="Full Name" required="true" 
								style="padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
							<input type="password" id="registerPassword" name="password" placeholder="Password" required="true" 
								style="padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
							<input type="country" id="registerCountry" name="country" placeholder="Country" required="true" 
								style="padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
							<div style="display: flex; justify-content: center; margin-top: 10px;">
								<label for="registerAvatar" style="cursor:pointer; text-align: center;">
									<p style="margin-bottom: 10px; color: #666;">Profile Picture</p>
									<img id="registerAvatarImg" src="./avatars/default-avatar.png"
										style="width:100px; height:100px; border-radius:50%; border:3px solid #4facfe; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
										alt="Select your avatar" />
								</label>
								<input type="file" id="registerAvatar" name="avatar" accept="image/*"
									style="display:none;" />
								<img id="avatarPreview" src="./avatars/default-avatar.png"
									style="width:100px; height:100px; display:none;" />
							</div>
						</div>
						<div style="display: flex; flex-direction: column; gap: 10px;">
							<button type="submit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Create Account</button>
							<div style="display: flex; gap: 10px; justify-content: space-between;">
								<button type="button" id="showRegisterPassword"
									class="nav-button text-white px-4 py-2 rounded" style="flex: 1;">Show Password</button>
								<button type="button" id="generalCancelRegistration"
									class="cancel-button px-4 py-2 rounded" style="flex: 1;">Cancel</button>
							</div>
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
		<div id="settings" style="display:none; position:absolute; flex-grow:1; display:none; flex-direction:column; top:10%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; width: 400px; color: #2c3e50; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
			<div style="display:flex; flex-direction:column; justify-content:space-between; align-items:center; height:100%;">
				<h2 id="settingsHeader" style="color: #2c3e50; font-size: 28px; margin-bottom: 20px; text-align: center; font-weight: 700;"></h2>
				
				<form id="settingsForm" method="post" style="flex-grow:1; display:flex; flex-direction:column; width: 100%; margin-bottom:20px; justify-content:space-between; align-items:center;">
					<div style="display: flex; flex-direction: column; gap: 15px; width: 100%; margin-bottom: 15px;">
						<div class="input-group" style="position: relative;">
							<label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">Name</label>
							<input type="text" id="settingsName" name="name" required="false" 
								style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
						</div>
						
						<div class="input-group" style="position: relative;">
							<label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">Username</label>
							<input type="text" id="settingsUsername" name="username" required="false" 
								style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
						</div>
						
						<div class="input-group" style="position: relative;">
							<label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">Password</label>
							<input type="password" id="settingsPassword" name="password" 
								style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
						</div>
						
						<div class="input-group" style="position: relative;">
							<label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">Country</label>
							<input type="text" id="settingsCountry" name="country" required="false" 
								style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
						</div>
					</div>

					<div id="avatarContainer" style="text-align:center; margin-bottom:20px; margin-top:10px;">
						<label style="display: block; margin-bottom: 8px; color: #666; font-size: 14px;">Profile Picture</label>
						<img id="avatarPreviewSettings" src="./avatars/default-avatar.png" alt="Avatar" 
							style="width:120px; height:120px; border-radius:50%; cursor:pointer; border:3px solid #4facfe; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
						<input type="file" id="avatarUpload" name="avatar" accept="image/*" style="display:none;" />
					</div>
					
					<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
						<button style="width: 100%;" type="submit" id="settingsSave" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Save Changes</button>
						<div style="display: flex; gap: 10px; width: 100%;">
							<button style="flex: 1;" type="button" id="showSettingsPassword" class="nav-button text-white px-4 py-2 rounded">Show Password</button>
							<button style="flex: 1;" type="button" id="settingsDeleteAccount" class="bg-red-500 text-white px-4 py-2 rounded" 
								style="background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%); border: none; font-weight: 600;">Delete Account</button>
						</div>
					</div>
				</form>
				
				<form id="settingsLogin" method="post" style="flex-grow:1; display:flex; flex-direction:column; width: 100%; margin-bottom:20px; gap: 15px;">
					<div class="input-group" style="position: relative;">
						<label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">Username</label>
						<input type="text" id="settingsLoginUsername" name="username" placeholder="Enter your username" required="true" 
							style="width: 100%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
					</div>
					
					<div class="input-group" style="position: relative;">
						<label style="display: block; margin-bottom: 5px; color: #666; font-size: 14px;">Password</label>
						<input type="password" id="settingsLoginPassword" name="password" placeholder="Enter your password" required="true" 
							style="width: 100%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; transition: all 0.3s;" />
					</div>
					
					<button type="submit" id="settingsLoginSubmit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Log In</button>
				</form>
				
				<button style="width: 100%;" type="button" id="settingsCancel" class="cancel-button px-4 py-3 rounded">Cancel</button>
			</div>
		</div>
		`;
	}
}

export class htmlFriends extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="friendStuff" style="display: none;">
			<div class="game-card" style="position:absolute; top: 140px; right: 20px; width: 350px; padding: 20px;">
				<header style="font-weight: 700; font-size: 24px; margin-bottom: 15px; color: white;">Friends</header> 
				<div style="display: flex; flex-direction: column; gap: 15px;">
					<div>
						<h3 style="font-size: 16px; margin-bottom: 8px; color: rgba(255,255,255,0.8);">Friend List</h3>
						<ul id="friendList" style="width: 100%; height: 150px; overflow-y: auto; padding: 10px; border-radius: 8px; background-color: rgba(0,0,0,0.4); color: white; list-style-type: none; margin: 0;">
							<li style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">Please login to see friends</li>
						</ul>
					</div>
					<div>
						<h3 style="font-size: 16px; margin-bottom: 8px; color: rgba(255,255,255,0.8);">Chat History</h3>
						<ul id="friendList2" style="width: 100%; height: 150px; overflow-y: auto; padding: 10px; border-radius: 8px; background-color: rgba(0,0,0,0.4); color: white; list-style-type: none; margin: 0; font-size: 12px;">
							<li style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">Please click a friend to see the history...</li>
						</ul>
					</div>
					<div>
						<h3 style="font-size: 16px; margin-bottom: 8px; color: rgba(255,255,255,0.8);">Friend Requests</h3>
						<div style="display: flex; gap: 10px;">
							<ul id="friendRequestsList" style="flex: 1; height: 100px; overflow-y: auto; padding: 10px; border-radius: 8px; background-color: rgba(0,0,0,0.4); color: white; list-style-type: none; margin: 0;">
								<li style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">Your new friend requests will appear here</li>
							</ul>
							<button style="width: 50px; height: 50px; display: none; border-radius: 50%; font-size: 24px; line-height: 0; align-self: flex-end;" id="addFriend" class="action-button text-white">+</button>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Message input below friend panel -->
			<div id="messages" class="game-card" style="position:absolute; display: none; top: calc(140px + 750px); right: 20px; width: 350px; padding: 15px;">
				<div style="display: flex; gap: 10px;">
					<input type="text" id="inputMessageBox" placeholder="Type your message here..."
						style="flex-grow: 1; border: none; border-radius: 20px; padding: 12px 20px; background: rgba(255, 255, 255, 0.9); color: #333;" />
					<button id="sendMessage" class="action-button text-white px-4 py-2 rounded" style="border-radius: 20px;">
						Send
					</button>
				</div>
			</div>
		</div>
		`;
	}
}


export class htmlTwoPlayerMatch extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="twoPlayerMatchContainer" style="display: none; position:absolute; top:30%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; color: #2c3e50; box-shadow: 0 10px 30px rgba(0,0,0,0.3); width: 400px;">
			<h1 id="twoPlayerMatchHeader" style="font-size: 28px; color: #2c3e50; font-weight: 700; text-align: center; margin-bottom: 20px;">Choose Game Mode</h1>
			
			<select id="twoPlayerMatchSelect" style="width: 100%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px; margin-bottom: 20px; appearance: none; background: url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>') no-repeat; background-position: calc(100% - 10px) center; padding-right: 30px;">
				<option value="" disabled selected>Select Game Mode</option>
				<option value="local">Local</option>
				<option value="remote">Remote</option>
			</select>
			
			<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
				<button id="twoPlayerMatchGuestGame" style="display: none; padding: 12px;" type="button" class="action-button text-white px-4 py-2 rounded">Guest vs. Player Match</button>
				<button id="twoPlayerMatchPlayerGame" style="display: none; padding: 12px;" type="button" class="action-button text-white px-4 py-2 rounded">Player vs. Player Match</button>
			</div>
			
			<form id="twoPlayerMatchLogin" method="post" style="display:none; flex-direction:column; gap: 15px; margin-bottom: 20px;">
				<h2 id="twoPlayerMatchLoginHeader" style="color: #2c3e50; font-size: 20px; font-weight: 600; margin-bottom: 10px;">Login to Continue</h2>
				
				<input type="text" id="twoPlayerMatchUsername" name="username" placeholder="Username" required="true" 
					style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
					
				<input type="password" id="twoPlayerMatchPassword" name="password" placeholder="Password" required="true" 
					style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
					
				<button type="submit" id="twoPlayerMatchLoginSubmit" class="action-button text-white px-4 py-3 rounded">Log In</button>
			</form>
			
			<form id="twoPlayerMatchInviteForm" method="post" style="display:none; flex-direction:column; gap: 15px; margin-bottom: 20px;">
				<h2 id="twoPlayerMatchInviteHeader" style="color: #2c3e50; font-size: 20px; font-weight: 600; margin-bottom: 10px;">Invite a Friend</h2>
				
				<input type="text" id="twoPlayerMatchInviteUsername" name="username" placeholder="Friend's Username" required="true" 
					style="width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
					
				<button type="submit" id="twoPlayerMatchInviteSubmit" class="action-button text-white px-4 py-3 rounded">Send Invite</button>
			</form>
			
			<button type="button" id="twoPlayerMatchCancel" class="cancel-button px-4 py-3 rounded" style="width: 100%;">Cancel</button>			
		</div>
		`;
	}
}

export class htmlMultiplayerMatch extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="multiplayerMatchInviteContainer" style="display: none; position:absolute; top:30%; left:50%; transform:translateX(-50%); background:rgba(255,255,255,0.95); padding:30px; border-radius:16px; z-index:10; color: #2c3e50; box-shadow: 0 10px 30px rgba(0,0,0,0.3); width: 400px;">
			<form id="multiplayerMatchInviteForm1" method="post" style="flex-grow:1; display:none; flex-direction:column; gap: 20px;">
				<h1 id="inviteMultiPlayerHeader1" style="font-size: 28px; color: #2c3e50; font-weight: 700; text-align: center;">Invite First Player</h1>
				<div style="display: flex; flex-direction: column; gap: 15px;">
					<input type="text" id="inputMultiplayerUsername1" name="username" placeholder="Enter first player's username" required="true"
						style="margin-bottom: 10px; width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
				</div>
				<div style="display: flex; flex-direction: column; gap: 10px;">
					<button id="sendInvite1" type="submit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Send Invite</button>
					<button id="cancelInvite1" type="button" class="cancel-button px-4 py-3 rounded">Cancel</button>
				</div>
			</form>
			<form id="multiplayerMatchInviteForm2" method="post" style="flex-grow:1; display:none; flex-direction:column; gap: 20px;">
				<h1 id="inviteMultiPlayerHeader2" style="font-size: 28px; color: #2c3e50; font-weight: 700; text-align: center;">Invite Second Player</h1>
				<div style="display: flex; flex-direction: column; gap: 15px;">
					<input type="text" id="inputMultiplayerUsername2" name="username" placeholder="Enter second player's username" required="true"
						style="margin-bottom: 10px; width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
				</div>
				<div style="display: flex; flex-direction: column; gap: 10px;">
					<button id="sendInvite2" type="submit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Send Invite</button>
					<button id="cancelInvite2" type="button" class="cancel-button px-4 py-3 rounded">Cancel</button>
				</div>
			</form>
			<form id="multiplayerMatchInviteForm3" method="post" style="flex-grow:1; display:none; flex-direction:column; gap: 20px;">
				<h1 id="inviteMultiPlayerHeader3" style="font-size: 28px; color: #2c3e50; font-weight: 700; text-align: center;">Invite Third Player</h1>
				<div style="display: flex; flex-direction: column; gap: 15px;">
					<input type="text" id="inputMultiplayerUsername3" name="username" placeholder="Enter third player's username" required="true"
						style="margin-bottom: 10px; width: 90%; padding: 12px 16px; border-radius: 8px; border: 2px solid #e0e0e0; font-size: 16px;" />
				</div>
				<div style="display: flex; flex-direction: column; gap: 10px;">
					<button id="sendInvite3" type="submit" class="action-button text-white px-4 py-3 rounded" style="font-size: 16px;">Send Invite</button>
					<button id="cancelInvite3" type="button" class="cancel-button px-4 py-3 rounded">Cancel</button>
				</div>
			</form>
		</div>
		`;
	}
}