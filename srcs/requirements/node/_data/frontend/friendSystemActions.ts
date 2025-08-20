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
							fetch(`/addFriendlist`, {
								method: "PUT",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									username: game.username,
									friendname: friendName
								})
							})
						} else {
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

export function friendRequestListFunction(game: GameInfo) {
	document.getElementById("friendRequestsList")?.addEventListener("click", (e) => {
		const target = e.target as HTMLElement;
		if (target.tagName === "LI") {
			console.log(`${target.textContent} clicked`);
			const friendName = target.id;
			const reply = confirm(`Do you want to accept the friend request from ${friendName}?`);
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

export function showFriendStatus() {
	document.addEventListener("DOMContentLoaded", () => {
		const friendList = document.getElementById("friendList");

		let hoverTimer: number | null = null;

		friendList?.addEventListener("mousemove", (e) => {
			const target = e.target as HTMLElement;

			// Only handle LI elements
			if (target.tagName === "LI") {
				if (hoverTimer === null) {
					// Start 3-second timer
					hoverTimer = window.setTimeout(() => {
						let userinfo = document.createElement("ul");
						userinfo.id = "userinfo";
						userinfo.style.position = "absolute";
						userinfo.style.left = `${e.clientX + 10}px`;
						userinfo.style.top = `${e.clientY + 10}px`;
						userinfo.style.backgroundColor = "#e4da17ff";
						userinfo.style.color = "black";
						userinfo.style.padding = "5px 8px";
						userinfo.style.borderRadius = "5px";
						userinfo.style.fontSize = "12px";
						userinfo.style.pointerEvents = "none";
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
								console.log("User info fetched:", data);
								for (const key in data) {
									const value = data[key];
									const infoItem = document.createElement("li");
									infoItem.textContent = `${key}: ${value}`;
									userinfo.appendChild(infoItem);
								}
							});
						console.log("Hover timer triggered for:", target.id);
					}, 3000);
				}

				// Update tooltip position if it's already visible
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
					document.body.removeChild(tooltip);
				}
			}
		});
	});
}
