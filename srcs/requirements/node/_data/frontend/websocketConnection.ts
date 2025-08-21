import { game } from "./index.js";

function handleFriendRequest(data: any) {
	const friendName = data.from;
	const result = confirm(`Do you want to accept the friend request from ${friendName}?`);
	if (result) {
		game.websocket?.send(JSON.stringify({ reply: "accept" }));
		const friendList = document.getElementById("friendList");
		if (friendList) {
			const newFriendItem = document.createElement("li");
			newFriendItem.id = friendName;
			newFriendItem.style.cursor = "pointer";
			newFriendItem.textContent = friendName;
			friendList.appendChild(newFriendItem);
		}
	} else {
		game.websocket?.send(JSON.stringify({ reply: "decline" }));
	}
}

function handlePrivateMessage(data: any) {
	const { target, from, message } = data;
	if (game.sendMessageTo === from || game.sendMessageTo === target) {
		const chatHistoryElement = document.getElementById("friendList2");
		if (chatHistoryElement) {
			const messageElement = document.createElement("LI");
			messageElement.textContent = `${from}: ${message}`;
			chatHistoryElement.appendChild(messageElement);
			chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
		}
	} else {
		const friendListElement = document.getElementById(from);
		if (friendListElement) {
			friendListElement.style.backgroundColor = "yellow"; // Highlight the friend's name
		}
	}
}

function handleWebSocketMessage(event: MessageEvent) {
	const data = JSON.parse(event.data);
	switch (data.type) {
		case "friendRequest":
			handleFriendRequest(data);
			break;
		case "privateMessage":
			handlePrivateMessage(data);
			break;
	}
};

export function createWebSocketConnection(username: string) {
	game.websocket = new WebSocket(`ws://10.12.11.10:3000/ws?username=${username}`);//TODO: change this everytime when we move to a new computer

	game.websocket.onopen = () => {
		console.log("✅ WebSocket connection established successfully!");
		// Send test message AFTER connection is established
	};

	game.websocket.onmessage = (event) => {
		console.log("📥 Received from server:", event.data);
		handleWebSocketMessage(event);
	};

	game.websocket.onclose = () => {
		console.log("WebSocket connection closed.");
	};

	game.websocket.onerror = (error) => {
		console.error("❌ WebSocket error:", error);
	};
}