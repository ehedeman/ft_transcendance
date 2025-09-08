
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
	<div id="tournamentRegistrationModal" class="hidden absolute top-[20%] left-1/2 transform -translate-x-1/2 bg-white/95 p-[30px] rounded-[16px] z-[10] w-[380px] text-[#2c3e50] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
		<div class="flex flex-col h-full">
			<h2 id="tournamentRegisterHeader" class="text-[#2c3e50] text-[28px] mb-[20px] text-center font-bold">
				Tournament Registration
			</h2>
			<form id="tournamentRegistrationForm" class="flex-grow flex flex-col gap-[20px]">
				<div class="flex flex-col gap-[15px]">
					<input type="text" id="tournamentUsername" name="username" placeholder="Username" required class="w-[90%] px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px]" />
					<input type="password" id="tournamentPassword" name="password" placeholder="Password" required class="w-[90%] px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px]" />
				</div>
				<div class="flex flex-col gap-[10px]">
					<button type="submit" class="bg-gradient-to-br from-[#0061ff] to-[#60efff] font-semibold text-white px-4 py-3 rounded text-[16px]">
						Continue
					</button>
					<div class="flex gap-[10px] justify-between">
						<button type="button" id="showTournamentPassword" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#4facfe] to-[#00f2fe] font-semibold text-white px-4 py-2 rounded">
							Show Password
						</button>
						<button type="button" id="cancelTournamentRegistration" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] font-semibold text-[#2c3e50] px-4 py-2 rounded">
							Cancel
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
	<div id="tournamentResults" class="hidden absolute top-[20%] left-1/2 transform -translate-x-1/2 bg-white/95 p-8 rounded-2xl z-10 w-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
		<h2 class="text-black text-[28px] mb-5 text-center font-bold">Tournament Results</h2>
		<div class="bg-black/5 rounded-lg p-4">
			<ol id="placementList" class="text-black text-[18px] pl-[30px]"></ol>
		</div>
	</div>

	<button id="tournamentFinishContinue" class="hidden absolute z-20 left-1/2 top-[10%] transform -translate-x-1/2 text-white px-6 py-3 rounded text-[16px] bg-gradient-to-br from-[#0061ff] to-[#60efff] border-none font-semibold">
	Continue
	</button>

	
	`;
}
}
// <button id="tournamentResetButton" class="hidden absolute z-20 left-1/2 top-[70px] transform -translate-x-1/2 font-semibold text-white px-5 py-2 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-200 bg-gradient-to-br from-[#ff4b2b] to-[#ff416c] border-none">
// 	Reset Tournament
// </button>

class htmlLogin extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="generalLoginModal" class="hidden absolute top-[20%] left-1/2 transform -translate-x-1/2 bg-white/95 p-[30px] rounded-[16px] z-[10] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
			<div class="flex flex-col h-full">
				<h2 class="text-[#2c3e50] text-[28px] mb-[20px] text-center font-bold">Login</h2>
				<form id="generalLoginForm" method="post" class="flex-grow flex flex-col justify-between text-[#2c3e50]">
					<div class="flex flex-col gap-[15px] mb-[25px]">
						<input type="text" id="loginUsername" name="username" placeholder="Alias" required class="px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						<input type="password" id="loginPassword" name="password" placeholder="Password" required class="px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
					</div>
					<div class="flex flex-col gap-[10px]">
						<button type="submit" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#0061ff] to-[#60efff] font-semibold text-white px-4 py-3 rounded text-[16px]">
							Continue
						</button>
						<div class="flex gap-[10px] justify-between">
							<button type="button" id="showLoginPassword" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#4facfe] to-[#00f2fe] font-semibold text-white px-4 py-2 rounded">
								Show Password
							</button>
							<button type="button" id="CancelGeneralLogin" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] font-semibold text-[#2c3e50] px-4 py-2 rounded">
								Cancel
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>

		`;
	}
}

			// <div id="avatarContainer" class="text-center mb-[20px] mt-[10px]">
			// 	<label class="block mb-[8px] text-[#666] text-[14px]">Profile Picture</label>
			// 	<img id="avatarPreviewSettings" src="./avatars/default-avatar.png" alt="Avatar" class="w-[120px] h-[120px] rounded-full cursor-pointer border-[3px] border-[#4facfe] object-cover shadow-[0_4px_8px_rgba(0,0,0,0.1)]" />
			// 	<input type="file" id="avatarUpload" name="avatar" accept="image/*" class="hidden" />
			// </div>

			// 	<div class="flex justify-center mt-[10px]">
			// 	<label for="registerAvatar" class="cursor-pointer text-center">
			// 		<p class="mb-[10px] text-[#666]">Profile Picture</p>
			// 		<img id="registerAvatarImg" src="./avatars/default-avatar.png" alt="Select your avatar" class="w-[100px] h-[100px] rounded-full border-[3px] border-[#4facfe] object-cover shadow-[0_4px_8px_rgba(0,0,0,0.1)]"/>
			// 	</label>
			// 	<input type="file" id="registerAvatar" name="avatar" accept="image/*" class="hidden"/>
			// </div>

			// 	<label for="registerAvatar" style="cursor:pointer; text-align: center;">
			// 		<p style="margin-bottom: 10px; color: #666;">Profile Picture</p>
			// 		<img id="registerAvatarImg" src="./avatars/default-avatar.png" style="width:100px; height:100px; border-radius:50%; border:3px solid #4facfe; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" alt="Select your avatar" />
			// 	</label>
			// 	<input type="file" id="registerAvatar" name="avatar" accept="image/*" style="display:none;" />
			// </div>


export class htmlRegistration extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="generalRegistrationModal" class="hidden absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-white/95 p-[30px] rounded-[16px] z-[10] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
			<div>
				<h2 class="text-[#2c3e50] text-[28px] mb-[20px] text-center font-bold">Register</h2>
				<form id="generalRegistrationForm" method="post" class="flex-grow flex flex-col justify-between text-[#2c3e50]">
					<div class="flex flex-col gap-[15px] mb-[25px]">
						<input type="text" id="registerName" name="name" placeholder="Alias" required class="px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						<input type="text" id="registerUsername" name="username" placeholder="Full Name" required class="px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						<input type="password" id="registerPassword" name="password" placeholder="Password" required class="px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						<input type="text" id="registerCountry" name="country" placeholder="Country" required class="px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						<div class="flex justify-center mt-[10px]">
							<label for="registerAvatar" class="cursor-pointer text-center">
								<p class="mb-[10px] text-[#666]">Profile Picture</p>
								<img id="registerAvatarImg" src="./avatars/default-avatar.png" alt="Select your avatar" class="w-[100px] h-[100px] rounded-full border-[3px] border-[#4facfe] object-cover shadow-[0_4px_8px_rgba(0,0,0,0.1)]"/>
							</label>
							<input type="file" id="registerAvatar" name="avatar" accept="image/*" class="hidden"/>
						</div>
					</div>
					<div class="flex flex-col gap-[10px]">
						<button type="submit" class="bg-gradient-to-br from-[#0061ff] to-[#60efff] font-semibold text-white px-4 py-3 rounded text-[16px]">
							Create Account
						</button>
						<div class="flex gap-[10px] justify-between">
							<button type="button" id="showRegisterPassword" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#4facfe] to-[#00f2fe] font-semibold text-white px-4 py-2 rounded">
								Show Password
							</button>
							<button type="button" id="generalCancelRegistration" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] font-semibold text-[#2c3e50] px-4 py-2 rounded">
								Cancel
							</button>
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
		<div id="settings" class="hidden absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-white/95 text-[#2c3e50] p-[30px] rounded-[16px] z-[10] w-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col flex-grow">
			<div class="flex flex-col justify-between items-center h-full">
				<h2 id="settingsHeader" class="text-[#2c3e50] text-[28px] mb-[20px] text-center font-bold"></h2>
				<form id="settingsForm" method="post" class="flex-grow flex flex-col w-full mb-[20px] justify-between items-center">
					<div class="flex flex-col gap-[15px] w-full mb-[15px]">
						<div class="relative">
							<label class="block mb-[5px] text-[#666] text-[14px]">Alias</label>
							<input type="text" id="settingsName" name="name" required class="w-[90%] px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						</div>
						<div class="relative">
							<label class="block mb-[5px] text-[#666] text-[14px]">Full Name</label>
							<input type="text" id="settingsUsername" name="username" required class="w-[90%] px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						</div>
						<div class="relative">
							<label class="block mb-[5px] text-[#666] text-[14px]">Password</label>
							<input type="password" id="settingsPassword" name="password" class="w-[90%] px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						</div>
						<div class="relative">
							<label class="block mb-[5px] text-[#666] text-[14px]">Country</label>
							<input type="text" id="settingsCountry" name="country" required class="w-[90%] px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
						</div>
					</div>
					<div id="avatarContainer" class="text-center mb-[20px] mt-[10px]">
						<label class="block mb-[8px] text-[#666] text-[14px]">Profile Picture</label>
						<img id="avatarPreviewSettings" src="./avatars/default-avatar.png" alt="Avatar" class="w-[120px] h-[120px] rounded-full cursor-pointer border-[3px] border-[#4facfe] object-cover shadow-[0_4px_8px_rgba(0,0,0,0.1)]" />
						<input type="file" id="avatarUpload" name="avatar" accept="image/*" class="hidden" />
					</div>
					<div class="flex flex-col gap-[10px] w-full">
						<button type="submit" id="settingsSave" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] w-full bg-gradient-to-br from-[#0061ff] to-[#60efff] font-semibold text-white px-4 py-3 rounded text-[16px]">
							Save Changes
						</button>
						<div class="flex gap-[10px] w-full">
							<button type="button" id="showSettingsPassword" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#4facfe] to-[#00f2fe] font-semibold text-white px-4 py-2 rounded">
								Show Password
							</button>
							<button type="button" id="settingsDeleteAccount" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex-1 bg-gradient-to-br from-[#ff4b2b] to-[#ff416c] font-semibold text-white px-4 py-2 rounded">
								Delete Account
							</button>
						</div>
					</div>
				</form>
				<form id="settingsLogin" method="post" class="flex-grow flex flex-col w-full mb-[20px] gap-[15px]">
					<div class="relative">
						<label class="block mb-[5px] text-[#666] text-[14px]">Username</label>
						<input type="text" id="settingsLoginUsername" name="username" placeholder="Enter your username" required class="w-full px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
					</div>
					<div class="relative">
						<label class="block mb-[5px] text-[#666] text-[14px]">Password</label>
						<input type="password" id="settingsLoginPassword" name="password" placeholder="Enter your password" required class="w-full px-[16px] py-[12px] rounded-lg border-2 border-[#e0e0e0] text-[16px] transition-all duration-300" />
					</div>
					<button type="submit" id="settingsLoginSubmit" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#0061ff] to-[#60efff] font-semibold text-white px-4 py-3 rounded text-[16px]">
						Log In
					</button>
				</form>
				<button type="button" id="settingsCancel" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] w-full bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] font-semibold text-[#2c3e50] px-4 py-3 rounded">
					Cancel
				</button>
			</div>
		</div>
		`;
	}
}

export class htmlFriends extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="friendStuff" class="hidden">
			<div class="bg-white/10 backdrop-blur-md rounded-[16px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] absolute top-[140px] right-5 w-[350px] p-5">
				<header class="font-bold text-2xl mb-4 text-white">Friends</header>
				<div class="flex flex-col gap-4">
					<div>
						<h3 class="text-base mb-2 text-white/80">
							Friend List
							</h3>
						<ul id="friendList" class="w-full h-[150px] overflow-y-auto p-2.5 rounded-lg bg-black/40 text-white list-none m-0">
							<li class="p-2 border-b border-white/10">
								Please login to see friends
							</li>
						</ul>
					</div>
					<div>
						<h3 class="text-base mb-2 text-white/80">
							Chat History
						</h3>
					<ul id="friendList2" class="w-full h-[150px] overflow-y-auto p-2.5 rounded-lg bg-black/40 text-white list-none m-0 text-xs">
						<li class="p-2 border-b border-white/10">
							Please click a friend to see the history...
						</li>
					</ul>
					</div>
					<div id="messages" class="hidden w-full">
						<div class="flex gap-2.5">
							<input type="text" id="inputMessageBox" placeholder="Type your message here..." class="flex-grow border-0 rounded-full px-5 py-3 bg-white/90 text-gray-800 placeholder:text-gray-500" />
							<button type="button" id="sendMessage" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold text-white px-3.5 py-2 rounded-full">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
        							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    							</svg>
							</button>
						</div>
					</div>
					<div>
						<h3 class="text-base mb-2 text-white/80">Friend Requests</h3>
						<div class="flex gap-2.5">
							<ul id="friendRequestsList" class="flex-1 h-[100px] overflow-y-auto p-2.5 rounded-lg bg-black/40 text-white list-none m-0">
								<li class="p-2 border-b border-white/10">
									Your new friend requests will appear here
								</li>
							</ul>
							<button type="button" id="addFriend" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] hidden w-[50px] h-[50px] rounded-full text-2xl leading-none self-end bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold text-white">
								+
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		`;
	}
}


export class htmlTwoPlayerMatch extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="twoPlayerMatchContainer" class="hidden absolute top-[30%] left-1/2 transform -translate-x-1/2 bg-white/95 p-[30px] rounded-[16px] z-10 text-[#2c3e50] shadow-[0_10px_30px_rgba(0,0,0,0.3)] w-[400px]">
			<h1 id="twoPlayerMatchHeader" class="text-[28px] text-[#2c3e50] font-bold text-center mb-5">
				Choose Game Mode
			</h1>

			<select id="twoPlayerMatchSelect" class="w-full px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-[16px] mb-5 appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=\'black\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>')] bg-no-repeat bg-[calc(100%-10px)_center] pr-[30px]">
				<option value="" disabled selected>Select Game Mode</option>
				<option value="local">Local</option>
				<option value="remote">Remote</option>
			</select>

			<div class="flex flex-col gap-2.5 mb-5">
				<button type="button" id="twoPlayerMatchGuestGame"class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] hidden px-4 py-3 rounded text-white bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold" type="button">
					Guest vs. Player Match
				</button>
				<button type="button" id="twoPlayerMatchPlayerGame" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] hidden px-4 py-3 rounded text-white bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold" type="button">
					Player vs. Player Match
				</button>
			</div>
			<form id="twoPlayerMatchLogin" method="post" class="hidden flex flex-col gap-[15px] mb-5">
				<h2 id="twoPlayerMatchLoginHeader" class="text-[#2c3e50] text-[20px] font-semibold mb-2.5">
					Login to Continue
				</h2>

				<input type="text" id="twoPlayerMatchUsername" name="username" required placeholder="Username" class="w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-[16px]" />
				<input type="password" id="twoPlayerMatchPassword" name="password" required placeholder="Password" class="w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-[16px]" />
				<button type="submit" id="twoPlayerMatchLoginSubmit" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] px-4 py-3 rounded text-white bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold">
					Log In
				</button>
			</form>

			<form id="twoPlayerMatchInviteForm" method="post" class="hidden flex flex-col gap-[15px] mb-5">
				<h2 id="twoPlayerMatchInviteHeader" class="text-[#2c3e50] text-[20px] font-semibold mb-2.5">
					Invite a Friend
				</h2>
				<input type="text" id="twoPlayerMatchInviteUsername" name="username" required placeholder="Friend's Username" class="w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-[16px]" />
				<button type="submit" id="twoPlayerMatchInviteSubmit" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] px-4 py-3 rounded text-white bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold">
					Send Invite
				</button>
			</form>
			<button type="button" id="twoPlayerMatchCancel" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] px-4 py-3 rounded w-full bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] border-0 font-semibold text-[#2c3e50]">
				Cancel
			</button>
		</div>
		`;
	}
}


			// <form id="twoPlayerMatchInviteForm" method="post" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[15px] mb-5">
			// 	<h2 id="twoPlayerMatchInviteHeader" class="text-[#2c3e50] text-[20px] font-semibold mb-2.5">
			// 		Invite a Friend
			// 	</h2>
			// 	<input type="text" id="twoPlayerMatchInviteUsername" name="username" required placeholder="Friend's Username" class="w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-[16px]" />
			// 	<button type="submit" id="twoPlayerMatchInviteSubmit" class="transform -translate-y-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] px-4 py-3 rounded text-white bg-gradient-to-br from-[#0061ff] to-[#60efff] border-0 font-semibold">
			// 		Send Invite
			// 	</button>
			// </form>

			
export class htmlMultiplayerMatch extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<div id="multiplayerMatchInviteContainer" class="hidden absolute top-[30%] left-1/2 -translate-x-1/2 bg-white/95 p-8 rounded-2xl z-10 text-[#2c3e50] shadow-[0_10px_30px_rgba(0,0,0,0.3)] w-[400px]">
		<!-- Form 1 -->
		<form id="multiplayerMatchInviteForm1" method="post" class="flex-grow hidden flex flex-col gap-5">
			<h1 id="inviteMultiPlayerHeader1" class="text-[28px] text-[#2c3e50] font-bold text-center">Invite First Player</h1>
			<div class="flex flex-col gap-[15px]">
			<input type="text" id="inputMultiplayerUsername1" name="username" placeholder="Enter first player's username" required
				class="mb-2 w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-base" />
			</div>
			<div class="flex flex-col gap-2.5">
			<button id="sendInvite1" type="submit" class="bg-gradient-to-br from-[#0061ff] to-[#60efff] border-none font-semibold text-white px-4 py-3 rounded text-base">Send Invite</button>
			<button id="cancelInvite1" type="button" class="bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] border-none font-semibold text-[#2c3e50] px-4 py-3 rounded">Cancel</button>
			</div>
		</form>

		<!-- Form 2 -->
		<form id="multiplayerMatchInviteForm2" method="post" class="flex-grow hidden flex flex-col gap-5">
			<h1 id="inviteMultiPlayerHeader2" class="text-[28px] text-[#2c3e50] font-bold text-center">Invite Second Player</h1>
			<div class="flex flex-col gap-[15px]">
			<input type="text" id="inputMultiplayerUsername2" name="username" placeholder="Enter second player's username" required
				class="mb-2 w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-base" />
			</div>
			<div class="flex flex-col gap-2.5">
			<button id="sendInvite2" type="submit" class="bg-gradient-to-br from-[#0061ff] to-[#60efff] border-none font-semibold text-white px-4 py-3 rounded text-base">Send Invite</button>
			<button id="cancelInvite2" type="button" class="bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] border-none font-semibold text-[#2c3e50] px-4 py-3 rounded">Cancel</button>
			</div>
		</form>

		<!-- Form 3 -->
		<form id="multiplayerMatchInviteForm3" method="post" class="flex-grow hidden flex flex-col gap-5">
			<h1 id="inviteMultiPlayerHeader3" class="text-[28px] text-[#2c3e50] font-bold text-center">Invite Third Player</h1>
			<div class="flex flex-col gap-[15px]">
			<input type="text" id="inputMultiplayerUsername3" name="username" placeholder="Enter third player's username" required
				class="mb-2 w-[90%] px-4 py-3 rounded-lg border-2 border-[#e0e0e0] text-base" />
			</div>
			<div class="flex flex-col gap-2.5">
			<button id="sendInvite3" type="submit" class="bg-gradient-to-br from-[#0061ff] to-[#60efff] border-none font-semibold text-white px-4 py-3 rounded text-base">Send Invite</button>
			<button id="cancelInvite3" type="button" class="bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] border-none font-semibold text-[#2c3e50] px-4 py-3 rounded">Cancel</button>
			</div>
		</form>
		</div>
		`;
	}
}