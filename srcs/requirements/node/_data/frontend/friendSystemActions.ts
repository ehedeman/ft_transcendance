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
				from: game.username,
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
			// Reset all other list items to white
			const listItems = document.querySelectorAll("#friendList li");
			listItems.forEach(li => {
				(li as HTMLElement).style.backgroundColor = "white";
			});
			target.style.backgroundColor = "lightblue";
			fetch(`/getChatHistory?username=${encodeURIComponent(game.username)}&friendname=${encodeURIComponent(game.sendMessageTo)}`)
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
			} else if (game.username === friendName) {
				alert("You cannot add yourself as a friend!");
			} else {
				fetch(`/addFriend?nameToAdd=${encodeURIComponent(friendName)}&accountName=${encodeURIComponent(game.username)}`)
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
		overlay.style.position = "fixed";
		overlay.style.top = "0";
		overlay.style.left = "0";
		overlay.style.width = "100vw";
		overlay.style.height = "100vh";
		overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
		overlay.style.display = "flex";
		overlay.style.alignItems = "center";
		overlay.style.justifyContent = "center";
		overlay.style.zIndex = "2000";

		// Create modal box
		const modal = document.createElement("div");
		modal.style.backgroundColor = "white";
		modal.style.padding = "20px";
		modal.style.borderRadius = "10px";
		modal.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
		modal.style.textAlign = "center";
		modal.style.width = "280px";
		modal.style.fontFamily = "Arial, sans-serif";

		// Message
		const msg = document.createElement("p");
		msg.textContent = message;
		msg.style.marginBottom = "15px";
		msg.style.fontSize = "14px";

		// Buttons container
		const buttonContainer = document.createElement("div");
		buttonContainer.style.display = "flex";
		buttonContainer.style.justifyContent = "space-around";

		// Yes button
		const yesBtn = document.createElement("button");
		yesBtn.textContent = "Yes";
		yesBtn.style.backgroundColor = "#4CAF50";
		yesBtn.style.color = "white";
		yesBtn.style.border = "none";
		yesBtn.style.padding = "6px 12px";
		yesBtn.style.borderRadius = "5px";
		yesBtn.style.cursor = "pointer";

		// No button
		const noBtn = document.createElement("button");
		noBtn.textContent = "No";
		noBtn.style.backgroundColor = "#f44336";
		noBtn.style.color = "white";
		noBtn.style.border = "none";
		noBtn.style.padding = "6px 12px";
		noBtn.style.borderRadius = "5px";
		noBtn.style.cursor = "pointer";

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
				fetch(`/acceptFriendRequest?username=${encodeURIComponent(friendName)}&friendname=${encodeURIComponent(game.username)}`)
					.then(response => {
						if (!response.ok) {
							throw new Error("Failed to send accept friend request.");
						}
						return response.json();
					})
					.then(data => {
						console.log("Friend request accepted:", data);
						getFriendList(game.username);
						getFriendRequestList(game.username);
					})
					.catch(error => {
						console.error("Error accepting friend request:", error);
					});
			} else {
				fetch(`/rejectFriendRequest?username=${encodeURIComponent(friendName)}&friendname=${encodeURIComponent(game.username)}`)
					.then(response => {
						if (!response.ok) {
							throw new Error("Failed to send reject friend request.");
						}
						return response.json();
					})
					.then(data => {
						console.log("Friend request rejected:", data);
						getFriendList(game.username);
						getFriendRequestList(game.username);
					})
					.catch(error => {
						console.error("Error rejecting friend request:", error);
					});
			}
		}
	});
}

function labelButton(target: HTMLElement, userinfo: HTMLElement, game: GameInfo) {
	let detailButton = document.createElement("button");
	detailButton.textContent = "View Details";
	detailButton.addEventListener("click", () => {
		const modal = document.createElement("div");
		modal.id = "userModal";
		modal.style.position = "fixed";
		modal.style.top = "0";
		modal.style.left = "0";
		modal.style.width = "100%";
		modal.style.height = "100%";
		modal.style.backgroundColor = "rgba(0,0,0,0.5)";
		modal.style.display = "flex";
		modal.style.justifyContent = "center";
		modal.style.alignItems = "center";
		modal.style.zIndex = "2000";

		modal.innerHTML = `
		<div style="background:#fff; padding:20px; border-radius:10px; width:300px; max-width:90%; position:relative; text-align:center;">
		<span id="closeModal" style="position:absolute; top:10px; right:15px; cursor:pointer; font-size:22px;">&times;</span>
		<h3>User Details: ${target.id}</h3>
		<div id="modalContent">Loading...</div>
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
					${data.avatarUrl ? `<img src="${data.avatarUrl}" alt="${target.id}'s avatar" style="width:80px; height:80px; border-radius:50%; margin-bottom:10px;">` : ""}
					${Object.entries(data).filter(([k]) => k !== "avatarUrl").map(([k, v]) => `<p>${k}: ${v}</p>`).join("")}
				`;
				const blockButton = document.createElement("button");
				blockButton.textContent = "Block User";
				blockButton.addEventListener("click", async () => {
					const result = await createConfirmModal(`Are you sure you want to block ${target.id}?`);
					if (result) {
						fetch(`/blockUser?blockUserName=${target.id}&UserName=${game.username}`)
							.then(response => {
								if (!response.ok) {
									throw new Error("Failed to block user.");
								}
								return response.json();
							})
							.then(data => {
								getFriendList(game.username);
								getFriendRequestList(game.username);
								alert(data.message);
							})
							.catch(error => {
								console.error("Error blocking user:", error);
							});
					}
				});
				content.appendChild(blockButton);
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
						userinfo.style.position = "absolute";
						userinfo.style.left = `${e.clientX}px`;
						userinfo.style.top = `${e.clientY}px`;
						userinfo.style.backgroundColor = "#e4da17ff";
						userinfo.style.color = "black";
						userinfo.style.padding = "5px 8px";
						userinfo.style.borderRadius = "5px";
						userinfo.style.fontSize = "12px";
						userinfo.style.pointerEvents = "auto";
						userinfo.style.zIndex = "1000";
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
								avatarImg.style.width = "50px";
								avatarImg.style.height = "50px";
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
