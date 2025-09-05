import { game } from "./index.js";

export function getFriendList(username: string) {
	fetch(`/getFriendList?username=${encodeURIComponent(username)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch friend list.");
			}
			return response.json();
		})
		.then(data => {
			console.log("Friend list:", data.friendList);
			game.friendList = data.friendList || [];
			const friendListElement = document.getElementById("friendList");
			if (friendListElement) {
				friendListElement.innerHTML = ""; // Clear existing list
				for (const friend of game.friendList) {
					const listItem = document.createElement("li");
					listItem.textContent = friend;
					listItem.id = friend;
					listItem.className = "cursor-pointer text-white"; // Ensure text is white on black background
					friendListElement.appendChild(listItem);
				}
			}
		})
		.catch(error => {
			console.error("Error fetching friend list:", error);
		});
}

export function getFriendRequestList(username: string) {
	fetch(`/getFriendRequestList?username=${encodeURIComponent(username)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch friend request list.");
			}
			return response.json();
		})
		.then(data => {
			console.log("Friend request list:", data.friendRequestList);
			game.friendRequestList = data.friendRequestList || [];
			if (game.friendRequestList.length === 0) {
				const friendRequestListElement = document.getElementById("friendRequestsList");
				if (friendRequestListElement) {
					friendRequestListElement.innerHTML = "<li class='text-white'>No friend requests</li>"; // Using Tailwind
				}
			}
			const friendRequestListElement = document.getElementById("friendRequestsList");
			if (friendRequestListElement) {
				friendRequestListElement.innerHTML = ""; // Clear existing list
				for (const request of game.friendRequestList) {
					const listItem = document.createElement("li");
					listItem.textContent = request;
					listItem.id = request;
					listItem.className = "cursor-pointer text-white"; // Ensure text is white on black background
					friendRequestListElement.appendChild(listItem);
				}
			}
		})
		.catch(error => {
			console.error("Error fetching friend request list:", error);
		});
}

export function getRejectedFriendRequests(username: string) {
	fetch(`/getRejectedFriendRequests?username=${encodeURIComponent(username)}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch rejected friend requests.");
			}
			return response.json();
		})
		.then(data => {
			console.log("Rejected friend requests:", data.rejectedFriendRequests);
			game.rejectedFriendRequests = data.rejectedFriendRequests || [];
			for (const request of game.rejectedFriendRequests) {
				alert(`Rejected friend request from: ${request}`);
			}
		})
		.catch(error => {
			console.error("Error fetching rejected friend requests:", error);
		});
}