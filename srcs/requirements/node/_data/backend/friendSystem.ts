import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { GameInfo } from './serverStructures.js';

export function friendSystem(app: FastifyInstance, db: any, game: GameInfo) {

	app.get('/addFriend', (request: FastifyRequest, rep: FastifyReply) => {
		const { nameToAdd, accountName } = request.query as {
			nameToAdd: string;
			accountName: string;
		};
		console.log(`Friend request: ${accountName} wants to add ${nameToAdd}`);
		// check if the user exist
		const userExists = db.prepare(`SELECT * FROM users WHERE Full_Name = ?`).get(nameToAdd);
		if (!userExists) {
			rep.status(404).send({ error: 'User not found' });
			return;
		} else {
			db.prepare(`INSERT INTO newFriend (username, friendname, status) VALUES (?, ?, ?)`).run(accountName, nameToAdd, 'pending');
		}
		// Check if the user is online
		if (game.sockets.has(nameToAdd)) {
			const tempSocket = game.sockets.get(nameToAdd);
			if (tempSocket) {
				tempSocket.send(JSON.stringify({
					type: 'friendRequest',
					to: nameToAdd,//b
					from: accountName//a
				}));
			}
			if (tempSocket) {
				tempSocket.on('message', (data) => {
					const strData = data.toString();
					const replyMessage: any = JSON.parse(strData);
					if (replyMessage.reply === "accept") {// change the database status
						db.prepare(`UPDATE newFriend SET status = 'accepted' WHERE username = ? AND friendname = ?`)
							.run(accountName, nameToAdd);
						rep.send({ message: `Friend '${nameToAdd}' added successfully` });
					} else {
						rep.status(404).send({ error: 'User not found' });
					}
				});
			}
		} else {
			rep.status(202).send({ message: 'Friend request sent' });
		}
	});

	app.put('/addFriendlist', async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, friendname } = request.body as {
			username: string;
			friendname: string;
		};

		if (!username || !friendname) {
			reply.status(400).send({ error: 'Username and friendname are required' });
			return;
		}

		try {
			const stmt = db.prepare(`INSERT INTO newFriend (username, friendname) VALUES (?, ?)`);
			stmt.run(username, friendname);
			reply.send({ message: `Friend '${friendname}' added to ${username}'s friend list` });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get('/getFriendList', async (request: FastifyRequest, reply: FastifyReply) => {
		const { username } = request.query as { username: string };
		if (!username) {
			reply.status(400).send({ error: 'Username is required' });
			return;
		}

		try {
			const stmt = db.prepare(`SELECT friendname FROM newFriend WHERE username = ? AND status = 'accepted'`);
			const rows = stmt.all(username) as { friendname: string }[];
			const friends = rows.map(row => row.friendname);
			const stmt2 = db.prepare(`SELECT username FROM newFriend WHERE friendname = ? AND status = 'accepted'`);
			const rows2 = stmt2.all(username) as { username: string }[];
			friends.push(...rows2.map(row => row.username));
			reply.send({ friendList: friends });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get(`/getChatHistory`, async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, friendname } = request.query as {
			username: string;
			friendname: string;
		};
		if (!username || !friendname) {
			reply.status(400).send({ error: 'Username and friendname are required' });
			return;
		}

		try {
			const stmt = db.prepare(`SELECT * FROM chatHistory WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)`);
			const chatHistory = stmt.all(username, friendname, friendname, username) as { sender: string; receiver: string; message: string; status: string; timestamp: string }[];
			const chatHistory1 = chatHistory.map((row) => row.sender + ": " + row.message);
			reply.send({ chatHistory: chatHistory1 });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get(`/getFriendRequestList`, async (request: FastifyRequest, reply: FastifyReply) => {
		const { username } = request.query as { username: string };
		if (!username) {
			reply.status(400).send({ error: 'Username is required' });
			return;
		}
		try {
			const stmt = db.prepare(`SELECT * FROM newFriend WHERE friendname = ? AND status = 'pending'`);
			const friendRequests = stmt.all(username) as { username: string; friendname: string; status: string }[];
			const friendRequestList = friendRequests.map((row) => row.username);
			reply.send({ friendRequestList });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get(`/acceptFriendRequest`, async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, friendname } = request.query as {
			username: string;
			friendname: string;
		};

		if (!username || !friendname) {
			reply.status(400).send({ error: 'Username and friendname are required' });
			return;
		}

		try {
			const stmt = db.prepare(`UPDATE newFriend SET status = 'accepted' WHERE username = ? AND friendname = ?`);
			stmt.run(username, friendname);
			reply.send({ message: `Friend request from ${friendname} accepted` });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get(`/rejectFriendRequest`, async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, friendname } = request.query as {
			username: string;
			friendname: string;
		};

		if (!username || !friendname) {
			reply.status(400).send({ error: 'Username and friendname are required' });
			return;
		}

		try {
			const stmt = db.prepare(`UPDATE newFriend SET status = 'rejected' WHERE username = ? AND friendname = ?`);
			stmt.run(username, friendname);
			reply.send({ message: `Friend request from ${friendname} rejected` });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
		if (game.sockets.has(friendname)) {
			const socket = game.sockets.get(friendname);
			if (socket) {
				socket.send(JSON.stringify({
					type: 'friendRequestResponse',
					from: username,
					response: 'rejected'
				}));
			}
		} else {
			return;
		}
	});

	app.get(`/getRejectedFriendRequests`, async (request: FastifyRequest, reply: FastifyReply) => {
		const { username } = request.query as { username: string };
		if (!username) {
			reply.status(400).send({ error: 'Username is required' });
			return;
		}

		try {
			const stmt = db.prepare(`SELECT * FROM newFriend WHERE username = ? AND status = 'rejected'`);
			const friendRequests = stmt.all(username) as { friendname: string }[];
			const rejectedFriendRequests = friendRequests.map((row) => row.friendname);
			reply.send({ rejectedFriendRequests });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
		const stmt2 = db.prepare(`DELETE FROM newFriend WHERE username = ? AND status = 'rejected'`);
		stmt2.run(username);
	});

	app.get("/userStatus", async (request, reply) => {
		const { username } = request.query as { username: string };

		if (!username) {
			reply.status(400).send({ status: 400, message: "Missing username" });
			return;
		}

		const stmt = db.prepare(`SELECT status, avatar_url FROM users WHERE full_name = ?`);
		const user = stmt.get(username);

		if (!user) {
			reply.status(404).send({ status: 404, message: "User not found" });
			return;
		}

		const status = user.status;

		const picPath = user.avatar_url;
		reply.send({ onlineStatus: status, avatarUrl: picPath, this: "is just a test", that: "is also a test", these: "are also tests", those: "are also tests" });
	});
}