import { GameInfo } from './frontendStructures.js';
import { game } from './index.js';

export function SendMessageHandler() {
	const sendButton = document.getElementById("sendMessage");
	const inputBox = document.getElementById("inputMessageBox") as HTMLInputElement;

	if (!sendButton || !inputBox) return; // safety check

	sendButton.addEventListener("click", () => {
		const inputMessage: string = inputBox.value.trim();

		if (game.websocket) {
			game.websocket.send(JSON.stringify({
				type: "privateMessage",
				target: game.sendMessageTo,
				from: game.currentlyLoggedIn.name,
				message: inputMessage
			}));
		}

		inputBox.value = "";
	});
}

export function getChatHistoryFunction(game: GameInfo) {
	document.getElementById("friendList")?.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		if (target.tagName === "LI") {
			if (!target.id) {
				console.log("LI element is missing an ID:", target);
				return;
			}
			console.log(`${target.textContent} clicked`);
			game.sendMessageTo = target.id;
			console.log(`Message will be sent to: ${game.sendMessageTo}`);
			
			// Show message input when a friend is selected Remi
			const messagesElement = document.getElementById("messages");
			if (messagesElement) {
				messagesElement.classList.remove("hidden");
			}
			
			// Reset all other list items to default background
			const listItems = document.querySelectorAll("#friendList li");
			listItems.forEach(li => {
				(li as HTMLElement).className = "text-white";
			});
			target.className = "bg-gray-700 text-white";
			fetch(`/getChatHistory?username=${encodeURIComponent(game.currentlyLoggedIn.name)}&friendname=${encodeURIComponent(game.sendMessageTo)}`)
				.then(response => {
					if (!response.ok) {
						throw new Error("Failed to fetch chat history.");
					}
					return response.json();
				})
				.then(data => {
					console.log("Chat history:", data.chatHistory);
					game.chatHistory = data.chatHistory || [];
					const chatHistoryElement = document.getElementById("friendList2");
					if (chatHistoryElement) {
						chatHistoryElement.innerHTML = ""; // Clear existing chat history
						for (const message of game.chatHistory) {
							const messageElement = document.createElement("LI");
							messageElement.textContent = message;
							messageElement.className = "text-white text-xs";
							chatHistoryElement.appendChild(messageElement);
						}
						chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
					}
				})
				.catch(error => {
					console.error("Error fetching chat history:", error);
				});
		}
	});
}

export function addFriendFunction(game: GameInfo) {
	document.getElementById("addFriend")?.addEventListener("click", () => {
		const friendName = prompt("Enter the name of the friend to add:");
		if (friendName) {
			if (game.friendList.includes(friendName)) {
				alert("Friend already added!");
			} else if (game.currentlyLoggedIn.name === friendName) {
				alert("You cannot add yourself as a friend!");
			} else {
				fetch(`/addFriend?nameToAdd=${encodeURIComponent(friendName)}&accountName=${encodeURIComponent(game.currentlyLoggedIn.name)}`)
					.then(response => {
						if (response.status === 202) {
							alert("Friend request sent!");
						} else if (response.ok) {
							alert("Friend added successfully!");
							const friendList = document.getElementById("friendList");
							if (friendList) {
								const newFriendItem = document.createElement("li");
								newFriendItem.id = friendName;
								newFriendItem.textContent = friendName;
								friendList.appendChild(newFriendItem);
							}
						} else {
							console.error(response);
							alert("Failed to add friend.");
						}
					})
			}
		} else {
			alert("Friend name cannot be empty!");
		}
	});
}

import { getFriendList, getFriendRequestList } from "./friendSystemFunctions.js";

export function createConfirmModal(message: string): Promise<boolean> {
	return new Promise((resolve) => {
		// Create overlay
		const overlay = document.createElement("div");
		overlay.className = "fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[2000]";
		overlay.classList.remove("hidden");

		// Create modal box
		const modal = document.createElement("div");
		modal.className = "bg-white p-5 rounded-lg shadow-lg text-center w-[280px] font-sans text-black";

		// Message
		const msg = document.createElement("p");
		msg.textContent = message;
		msg.className = "mb-4 text-sm text-black";

		// Buttons container
		const buttonContainer = document.createElement("div");
		buttonContainer.className = "flex justify-around";

		// Yes button
		const yesBtn = document.createElement("button");
		yesBtn.textContent = "Yes";
		yesBtn.className = "bg-green-500 text-white border-none px-3 py-1.5 rounded cursor-pointer";

		// No button
		const noBtn = document.createElement("button");
		noBtn.textContent = "No";
		noBtn.className = "bg-red-500 text-white border-none px-3 py-1.5 rounded cursor-pointer";

		// Append everything
		buttonContainer.appendChild(yesBtn);
		buttonContainer.appendChild(noBtn);
		modal.appendChild(msg);
		modal.appendChild(buttonContainer);
		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		// Event listeners
		yesBtn.addEventListener("click", () => {
			document.body.removeChild(overlay);
			resolve(true);
		});

		noBtn.addEventListener("click", () => {
			document.body.removeChild(overlay);
			resolve(false);
		});
	});
}

export function friendRequestListFunction(game: GameInfo) {
	document.getElementById("friendRequestsList")?.addEventListener("click", async (e) => {
		const target = e.target as HTMLElement;
		if (target.tagName === "LI") {
			console.log(`${target.textContent} clicked`);
			const friendName = target.id;
			const reply = await createConfirmModal(`Do you want to accept the friend request from ${friendName}?`);
			if (reply) {
				fetch(`/acceptFriendRequest?username=${encodeURIComponent(friendName)}&friendname=${encodeURIComponent(game.currentlyLoggedIn.name)}`)
					.then(response => {
						if (!response.ok) {
							throw new Error("Failed to send accept friend request.");
						}
						return response.json();
					})
					.then(data => {
						console.log("Friend request accepted:", data);
						getFriendList(game.currentlyLoggedIn.name);
						getFriendRequestList(game.currentlyLoggedIn.name);
					})
					.catch(error => {
						console.error("Error accepting friend request:", error);
					});
			} else {
				fetch(`/rejectFriendRequest?username=${encodeURIComponent(friendName)}&friendname=${encodeURIComponent(game.currentlyLoggedIn.name)}`)
					.then(response => {
						if (!response.ok) {
							throw new Error("Failed to send reject friend request.");
						}
						return response.json();
					})
					.then(data => {
						console.log("Friend request rejected:", data);
						getFriendList(game.currentlyLoggedIn.name);
						getFriendRequestList(game.currentlyLoggedIn.name);
					})
					.catch(error => {
						console.error("Error rejecting friend request:", error);
					});
			}
		}
	});
}
import { startRemote1v1Game } from "./remote1v1GameInterface.js";
function labelButton(target: HTMLElement, userinfo: HTMLElement, game: GameInfo) {
	let detailButton = document.createElement("button");
	detailButton.textContent = "View Details";
	detailButton.addEventListener("click", () => {
		const modal = document.createElement("div");
		modal.id = "userModal";
		modal.className = "fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[2000]";
		modal.classList.remove("hidden");

		modal.innerHTML = `
		<div class="bg-white p-5 rounded-lg w-[300px] max-w-[90%] relative text-center text-black">
		<span id="closeModal" class="absolute top-2.5 right-4 cursor-pointer text-xl">&times;</span>
		<h3 class="text-black">User Details: ${target.id}</h3>
		<div id="modalContent" class="text-black">Loading...</div>
		</div>
		`;

		document.body.appendChild(modal);

		// Close button
		modal.querySelector("#closeModal")?.addEventListener("click", () => {
			document.body.removeChild(modal);
		});

		// Fetch user details
		fetch(`/userStatus?username=${target.id}`)
			.then(res => res.json())
			.then(data => {
				const content = modal.querySelector("#modalContent")!;
				content.innerHTML = `
					${data.avatarUrl ? `<img src="${data.avatarUrl}" alt="${target.id}'s avatar" class="w-20 h-20 rounded-full mb-2.5">` : ""}
					${Object.entries(data).filter(([k]) => k !== "avatarUrl").map(([k, v]) => `<p>${k}: ${v}</p>`).join("")}
				`;
				const blockButton = document.createElement("button");
				blockButton.textContent = "Block User";
				blockButton.addEventListener("click", async () => {
					const result = await createConfirmModal(`Are you sure you want to block ${target.id}?`);
					if (result) {
						fetch(`/blockUser?blockUserName=${target.id}&UserName=${game.currentlyLoggedIn.name}`)
							.then(response => {
								if (!response.ok) {
									throw new Error("Failed to block user.");
								}
								return response.json();
							})
							.then(data => {
								getFriendList(game.currentlyLoggedIn.name);
								getFriendRequestList(game.currentlyLoggedIn.name);
								alert(data.message);
								document.body.removeChild(modal);
							})
							.catch(error => {
								console.error("Error blocking user:", error);
							});
					}
				});
				content.appendChild(blockButton);
				const inviteButton = document.createElement("button");
				inviteButton.textContent = "Invite User";
				content.appendChild(inviteButton);
				inviteButton.addEventListener("click", async () => {
					fetch(`/inviteUserTo1v1Game?invitedUser=${encodeURIComponent(target.id)}&username=${game.currentlyLoggedIn.name}`)
						.then(response => {
							if (!response.ok) {
								throw new Error(response.statusText);
							} else if (response.status === 200) {
								alert("The game will start soon.");
								document.body.removeChild(modal);
								game.remoteMode = true;
								startRemote1v1Game(game.currentlyLoggedIn.name, target.id);
							}
						})
						.catch(error => {
							alert("Failed to invite user.");
							console.error("Error inviting user:", error);
						});
				});
			});

	});
	userinfo.appendChild(detailButton);
}

export function showFriendStatus(game: GameInfo) {
	document.addEventListener("DOMContentLoaded", () => {
		const friendList = document.getElementById("friendList");

		let hoverTimer: number | null = null;

		friendList?.addEventListener("mousemove", (e) => {
			const target = e.target as HTMLElement;

			// Only handle LI elements
			if (target.tagName === "LI") {
				if (!target.id) {
					console.log("LI element is missing an ID:", target);
					return;
				}
				if (hoverTimer === null) {
					// Start 3-second timer
					hoverTimer = window.setTimeout(() => {
						let userinfo = document.createElement("ul");
						userinfo.id = "userinfo";
						userinfo.className = "absolute bg-yellow-300 text-black p-2 rounded text-xs pointer-events-auto z-[1000]";
						// We need to keep these dynamic position styles inline since they depend on mouse position
						userinfo.style.left = `${e.clientX}px`;
						userinfo.style.top = `${e.clientY}px`;
						document.body.appendChild(userinfo);
						fetch(`/userStatus?username=${target.id}`)
							.then(response => {
								if (!response.ok) {
									console.error("Failed to fetch user status");
									return;
								}
								return response.json();
							})
							.then(data => {
								const avatarUrl = data.avatarUrl || "";
								const avatarImg = document.createElement("img");
								console.log("Avatar URL:", avatarUrl);
								avatarImg.src = avatarUrl;
								avatarImg.alt = `${target.id}'s avatar`;
								avatarImg.className = "w-12 h-12";
								userinfo.appendChild(avatarImg);
								for (const key in data) {
									if (key !== "avatarUrl") {
										const infoItem = document.createElement("li");
										infoItem.textContent = `${key}: ${data[key]}`;
										userinfo.appendChild(infoItem);
									}
								}
							})
							.then(() => {
								labelButton(target, userinfo, game);
								console.log("Hover timer triggered for:", target.id);
							});
					}, 3000);
				}
			}
		});

		friendList?.addEventListener("mouseleave", () => {
			// Reset timer and hide tooltip when mouse leaves UL
			if (hoverTimer) {
				clearTimeout(hoverTimer);
				hoverTimer = null;
			}
		});

		friendList?.addEventListener("mouseout", (e) => {
			const target = e.target as HTMLElement;
			if (target.tagName === "LI") {
				// Reset timer when leaving the LI
				if (hoverTimer) {
					clearTimeout(hoverTimer);
					hoverTimer = null;
				}
				const tooltip = document.getElementById("userinfo");
				if (tooltip) {
					// document.body.removeChild(tooltip);
					setTimeout(() => {
						if (tooltip && tooltip.parentNode) {
							tooltip.parentNode.removeChild(tooltip);
						}
					}, 2000);
				}
			}
		});

	});
}
