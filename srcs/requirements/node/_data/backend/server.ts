import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import websocket from '@fastify/websocket';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt'; // for hashing password
import fastifyMultipart from '@fastify/multipart';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream } from 'fs';
const saltRounds = 10;

const app = fastify({ logger: true });

await app.register(websocket);
await app.register(fastifyMultipart);

const pump = promisify(pipeline);

// import path from 'path';
import { fileURLToPath } from 'url';

import { GameInfo, userInfo, loginInfo } from './serverStructures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let game = new GameInfo();


import { mkdirSync } from 'fs';
const dataDir = path.join(__dirname, 'data');
try {
	mkdirSync(dataDir, { recursive: true });
} catch (err) {
	// Directory already exists, ignore
}

const db = new Database(path.join(__dirname, 'data', 'users.db'));

// Create tables if they don't exist
db.exec(`
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	Full_Name TEXT UNIQUE NOT NULL,
	Alias TEXT UNIQUE NOT NULL,
	Country TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	avatar_url TEXT DEFAULT '/avatars/default-avatar.png',
	status TEXT DEFAULT 'offline',
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the newFriend table
CREATE TABLE IF NOT EXISTS newFriend (
    username TEXT NOT NULL,
    friendname TEXT NOT NULL,
	status TEXT DEFAULT 'accepted',
    UNIQUE (username, friendname)
);

-- Create new chat history table
CREATE TABLE IF NOT EXISTS chatHistory (
	sender TEXT NOT NULL,
	receiver TEXT NOT NULL,
	message TEXT NOT NULL,
	status TEXT DEFAULT 'sent',
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friends (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	friend_id INTEGER NOT NULL,
	status TEXT DEFAULT 'pending',
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (friend_id) REFERENCES users(id),
	UNIQUE (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS matches (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	player1_id INTEGER NOT NULL,
	player2_id INTEGER NOT NULL,
	winner_id INTEGER,
	score_player1 INTEGER DEFAULT 0,
	score_player2 INTEGER DEFAULT 0,
	Match_type TEXT DEFAULT 'Friendly',
	match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (player1_id) REFERENCES users(id),
	FOREIGN KEY (player2_id) REFERENCES users(id),
	FOREIGN KEY (winner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_stats (
	user_id INTEGER PRIMARY KEY,
	wins INTEGER DEFAULT 0,
	losses INTEGER DEFAULT 0,
	matches_played INTEGER DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES users(id)
);
`);

let rounds = 1;

let gameFinished = false;

function touchingPaddle1(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player1Paddle.x + game.player1Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player1Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player1Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player1Paddle.y + game.player1Paddle.height
	);
}

function touchingPaddle2(): boolean {
	return (
		game.ball.ballX - game.ball.ballRadius < game.player2Paddle.x + game.player2Paddle.width &&
		game.ball.ballX + game.ball.ballRadius > game.player2Paddle.x &&
		game.ball.ballY + game.ball.ballRadius > game.player2Paddle.y &&
		game.ball.ballY - game.ball.ballRadius < game.player2Paddle.y + game.player2Paddle.height
	);
}

function resetBall(): void {
	game.ball.ballX = game.canvas.width / 2;
	game.ball.ballY = game.canvas.height / 2;
	game.ball.ballPaused = true;
	game.ball.ballSpeedX = Math.random() > 0.5 ? (Math.random() + 3) : -(Math.random() + 3);
	game.ball.ballSpeedY = (Math.random() * 2 - 1) * 3;
	game.player1Paddle.y = game.canvas.height / 2 - game.player1Paddle.height / 2;
	game.player2Paddle.y = game.canvas.height / 2 - game.player2Paddle.height / 2;
}

let accaleration = 0.1; // Speed increase factor

function calculateBallCoords(): void {
	if (game.ball.ballPaused) return; // Skip updates if the ball is paused
	game.ball.ballX += game.ball.ballSpeedX;
	game.ball.ballY += game.ball.ballSpeedY;

	// Bounce off top and bottom
	if (game.ball.ballY - game.ball.ballRadius < 0 || game.ball.ballY + game.ball.ballRadius > game.canvas.height) {
		game.ball.ballSpeedY *= -1;
	}

	// Check paddle collisions
	if (touchingPaddle1() && game.ball.ballSpeedX > 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX < 30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
	} else if (touchingPaddle2() && game.ball.ballSpeedX < 0) {
		// ballSpeedX *= -1 - accaleration;
		if (game.ball.ballSpeedX > -30) {
			game.ball.ballSpeedX *= -1 - accaleration; // Increase speed on paddle hit
		} else {
			game.ball.ballSpeedX *= -1; // Just reverse direction if already fast
		}
	}

	// Check if ball passed player1 (left side)
	if (game.ball.ballX - game.ball.ballRadius < 0) {
		game.player1.playerscore++;
		resetBall();
	}

	// Check if ball passed player2 (right side)
	if (game.ball.ballX + game.ball.ballRadius > game.canvas.width) {
		game.player2.playerscore++;
		resetBall();
	}
}

function resetGame(): void {
	game.player1.playerscore = 0;
	game.player2.playerscore = 0;
	resetBall();
	gameFinished = false;
}

function updateGame(): void {
	if (!gameFinished) {
		if (game.player1.playerscore === rounds) {
			game.player1.gamesWon++;
			game.player2.gamesLost++;
			gameFinished = true;
		}
		if (game.player2.playerscore === rounds) {
			game.player2.gamesWon++;
			game.player1.gamesLost++;
			gameFinished = true;
		}
		calculateBallCoords();
	}
}

setInterval(() => {
	updateGame();
}, 1000 / 60);

app.register(fastifyStatic, {
	root: path.join(__dirname, '../public'),
	prefix: '/',
});

app.get('/', (request, reply) => {
	reply.type('text/html').sendFile('index.html');
});

app.get('/ping', async () => {
	return { pong: 'it works!' };
});

app.get('/pressspace', async (request, reply) => {
	game.ball.ballPaused = !game.ball.ballPaused;
	reply.send({ status: game.ball.ballPaused ? 'Ball paused' : 'Ball unpaused' });
});

app.get('/pressArrowUp', async (request, reply) => {
	if (game.player1Paddle.y > 0 && !game.ball.ballPaused) {
		game.player1Paddle.y -= 5; // Move paddle up
	}
	reply.send({ status: 'Paddle 1 moved up' });
});

app.get('/pressArrowDown', async (request, reply) => {
	if (game.player1Paddle.y + game.player1Paddle.height < game.canvas.height && !game.ball.ballPaused) {
		game.player1Paddle.y += 5; // Move paddle down
	}
	reply.send({ status: 'Paddle 1 moved down' });
});

app.get('/pressW', async (request, reply) => {
	if (game.player2Paddle.y > 0 && !game.ball.ballPaused) {
		game.player2Paddle.y -= 5; // Move paddle up
	}
	reply.send({ status: 'Paddle 2 moved up' });
});

app.get('/pressS', async (request, reply) => {
	if (game.player2Paddle.y + game.player2Paddle.height < game.canvas.height && !game.ball.ballPaused) {
		game.player2Paddle.y += 5; // Move paddle down
	}
	reply.send({ status: 'Paddle 2 moved down' });
});

app.get('/resetgame', async (request, reply) => {
	resetGame();
	reply.type('application/json').send({
		ballX: game.ball.ballX,
		ballY: game.ball.ballY,
		player1_y: game.player1Paddle.y,
		player2_y: game.player2Paddle.y,
		player1_score: game.player1.playerscore,
		player2_score: game.player2.playerscore,
		gamefinished: gameFinished,
	});
});

app.get('/getstatus', async (request, reply) => {
	reply.type('application/json').send({
		ballX: game.ball.ballX,
		ballY: game.ball.ballY,
		player1_y: game.player1Paddle.y,
		player2_y: game.player2Paddle.y,
		player1_score: game.player1.playerscore,
		player2_score: game.player2.playerscore,
		gamefinished: gameFinished,
		ballSpeedX: game.ball.ballSpeedX,
	});
});




app.post("/register", async (request, reply) => {
	const parts = request.parts();
	let name = '', username = '', password = '', country = '';
	let avatarPath = '/avatars/default-avatar.png';
	let avatarUploaded = false;

	for await (const part of parts) {
		if (part.type === 'file') {
			// Save avatar file
			if (part.fieldname === 'avatar' && part.filename) {
				const fileExt = path.extname(part.filename);
				const uniqueName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${fileExt}`;
				const savePath = path.join(__dirname, '../public/avatars', uniqueName);

				// In v8+, use the file property which is a readable stream
				await pump((part as any).file, createWriteStream(savePath));
				avatarPath = `/avatars/${uniqueName}`;
				avatarUploaded = true;
			} else {
				// Unknown file part -- skip by consuming the stream
				const fileStream = (part as any).file;
				fileStream.resume();
			}
		} else if (part.type === 'field') {
			// Handle text fields - v8+ has better type safety for fields
			const fieldValue = (part as any).value;
			// console.log("Part:", part.type, part.fieldname, part.filename || part.value); // debug me
			switch (part.fieldname) {
				case 'name': name = fieldValue; break;
				case 'username': username = fieldValue; break;
				case 'password': password = fieldValue; break;
				case 'country': country = fieldValue; break;
			}
		}
	}

	if (!name || !username || !password || !country) {
		console.log("---------------------------------------------1---------------------------------------------");
		reply.status(400).send({ status: 400, message: 'Missing required fields' });
		return;
	}

	const alias = username;
	const fullName = name;
	const Country = country;
	const password_hash = await bcrypt.hash(password, saltRounds);

	try {
		const statement = db.prepare(`
		INSERT INTO users (Full_name, Alias, password_hash, Country, avatar_url)
		VALUES (?, ?, ?, ?, ?)
		`);
		statement.run(fullName, alias, password_hash, Country, avatarPath);
		console.log("---------------------------------------------4---------------------------------------------");
		reply.send({ status: 200, message: 'User registered successfully', avatar: avatarPath });
	} catch (err: any) {
		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			console.log("---------------------------------------------2---------------------------------------------");
			reply.status(400).send({ status: 400, message: 'User already exists' });
		} else {
			console.log("---------------------------------------------3---------------------------------------------");
			reply.status(500).send({ status: 500, message: 'Server error' });
		}
	}
	console.log(`User ${username} registered successfully`);
});



app.post("/updateUser", async (request, reply) => {
	const parts = request.parts();

	let id = "", name = "", username = "", password = "", country = "";
	let avatarPath: string | null = null;

	try {
		for await (const part of parts) {
			if (part.type === "file") {
				if (part.fieldname === "avatar" && part.filename) {
					const fileExt = path.extname(part.filename).toLowerCase();
					const uniqueName = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${fileExt}`;
					const savePath = path.join(__dirname, "../public/avatars", uniqueName);

					await pump((part as any).file, createWriteStream(savePath));
					avatarPath = `/avatars/${uniqueName}`;
				} else {
					(part as any).file.resume();
				}
			} else if (part.type === "field") {
				const fieldValue = (part as any).value?.toString().trim() || "";
				switch (part.fieldname) {
					case "id": id = fieldValue; break;
					case "name": name = fieldValue; break;
					case "username": username = fieldValue; break;
					case "password": password = fieldValue; break;
					case "country": country = fieldValue; break;
					case "avatar_url": if (!avatarPath) avatarPath = fieldValue; break;
				}
			}
		}

		if (!id) {
			reply.status(400).send({ status: 400, message: "Missing user ID" });
			return;
		}
		console.log(password); // debug
		console.log(id); // debug

		// hash the password if it was changed.
		let password_hash = password;
		if (password && !password.startsWith("$2b$")) {
			password_hash = await bcrypt.hash(password, saltRounds);
		}

		const updateQuery = `
            UPDATE users
            SET Full_Name = ?, Alias = ?, password_hash = ?, Country = ?, avatar_url = ?
            WHERE id = ?
        `;
		db.prepare(updateQuery).run(name, username, password_hash, country, avatarPath, id);

		reply.send({ status: 200, message: "User updated successfully", avatar: avatarPath });
	} catch (err) {
		console.error("Error updating user:", err);
		reply.status(500).send({ status: 500, message: "Server error" });
	}
});



// app.get('/getstatus', async (request, reply) => {
// 	reply.type('application/json').send({
// 		ballX: game.ball.ballX,
// 		ballY: game.ball.ballY,
// 		player1_y: game.player1Paddle.y,
// 		player2_y: game.player2Paddle.y,
// 		player1_score: game.player1.playerscore,
// 		player2_score: game.player2.playerscore,
// 		gamefinished: gameFinished,
// 		ballSpeedX: game.ball.ballSpeedX,
// 	});
// });



app.post("/userInfo", async (request, reply) => {
	const _username = request.body as { username: string };

	const stmt = db.prepare(`SELECT * FROM users WHERE Alias = ?`);
	const user = stmt.get(_username.username) as userInfo;

	if (!user || !user.Alias || !user.Full_Name || !user.Country || !user.avatar_url || !user.password_hash) {
		reply.status(401).send({ status: 401, message: 'User data incomplete or not found' });
		return;
	}

	console.log("this is in the backend");
	console.log(user.avatar_url);
	console.log("this is in the backend");
	reply.type('application/json').send({
		id: user.id,
		alias: user.Alias,
		fullName: user.Full_Name,
		country: user.Country,
		avatarPath: user.avatar_url,
		password: user.password_hash
	});
})

app.post("/login", async (request, reply) => {
	const { username, password } = request.body as { username: string; password: string };

	const stmt = db.prepare(`SELECT * FROM users WHERE Alias = ?`);
	const user = stmt.get(username) as any;

	if (!user) {
		reply.status(401).send({ status: 401, message: 'Invalid username or password' });
		return;
	}

	const match = await bcrypt.compare(password, user.password_hash);
	if (!match) {
		reply.status(401).send({ status: 401, message: 'Invalid username or password' });
		return;
	}

	// const user = loginInformation.find(user => user.username === username && user.password === password);
	// if (!user) {
	// 	reply.status(401).send({ status: 401, message: 'Invalid username or password' });
	// 	return;
	// }
	reply.send({ status: 200, message: 'Login successful', user });
});

app.get('/debug/users', async (request, reply) => {
	try {
		const stmt = db.prepare(`SELECT id, Full_Name, Alias, avatar_url, Country, status, created_at FROM users`);
		const users = stmt.all();
		reply.send({ users });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

// Debug endpoint to show tables
app.get('/debug/tables', async (request, reply) => {
	try {
		const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`);
		const tables = stmt.all();
		reply.send({ tables });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.delete('/debug/users/:username', async (request, reply) => {
	try {
		const { username } = request.params as { username: string };
		const stmt = db.prepare(`DELETE FROM users WHERE Alias = ?`);
		const result = stmt.run(username);

		if (result.changes === 0) {
			reply.status(404).send({ error: 'User not found' });
		} else {
			reply.send({ message: `User '${username}' deleted successfully`, deletedRows: result.changes });
		}
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

// Update user endpoint
app.put('/debug/users/:username', async (request, reply) => {
	try {
		const { username } = request.params as { username: string };
		const { Full_Name, avatar_url, status } = request.body as {
			Full_Name?: string;
			avatar_url?: string;
			status?: string;
		};

		// Build dynamic UPDATE query based on provided fields
		const updates: string[] = [];
		const values: any[] = [];

		if (Full_Name !== undefined) {
			updates.push('Full_Name = ?');
			values.push(Full_Name);
		}
		if (avatar_url !== undefined) {
			updates.push('avatar_url = ?');
			values.push(avatar_url);
		}
		if (status !== undefined) {
			updates.push('status = ?');
			values.push(status);
		}

		if (updates.length === 0) {
			reply.status(400).send({ error: 'No fields to update provided' });
			return;
		}

		// Add updated_at timestamp
		updates.push('updated_at = CURRENT_TIMESTAMP');

		// Add username to values array for WHERE clause
		values.push(username);

		const query = `UPDATE users SET ${updates.join(', ')} WHERE Alias = ?`;
		const stmt = db.prepare(query);
		const result = stmt.run(...values);

		if (result.changes === 0) {
			reply.status(404).send({ error: 'User not found' });
		} else {
			reply.send({
				message: `User '${username}' updated successfully`,
				updatedRows: result.changes,
				updatedFields: updates.slice(0, -1) // Remove the timestamp update from display
			});
		}
	} catch (err: any) {
		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			reply.status(400).send({ error: 'Full_Name must be unique' });
		} else {
			reply.status(500).send({ error: 'Database error' });
		}
	}
});

// Update user password endpoint
app.put('/debug/users/:username/password', async (request, reply) => {
	try {
		const { username } = request.params as { username: string };
		const { newPassword } = request.body as { newPassword: string };

		if (!newPassword || newPassword.trim() === '') {
			reply.status(400).send({ error: 'New password is required' });
			return;
		}

		const password_hash = await bcrypt.hash(newPassword, saltRounds);

		const stmt = db.prepare(`
			UPDATE users 
			SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
			WHERE Alias = ?
		`);
		const result = stmt.run(password_hash, username);

		if (result.changes === 0) {
			reply.status(404).send({ error: 'User not found' });
		} else {
			reply.send({
				message: `Password for user '${username}' updated successfully`,
				updatedRows: result.changes
			});
		}
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.put('/debug/friends', async (request, reply) => {
	try {
		const stmt = db.prepare(`SELECT id, user_id, friend_id FROM friends`);
		const friends = stmt.all();
		reply.send({ friends });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

function handlePrivateMessage(message: any) {
	const targetSocket = game.sockets.get(message.target);
	if (targetSocket) {
		targetSocket.send(JSON.stringify(message));
	}
	const sourceSocket = game.sockets.get(message.from);
	if (sourceSocket) {
		sourceSocket.send(JSON.stringify(message));
	}
	// Save chat history to the database
	try {
		const stmt = db.prepare(`INSERT INTO chatHistory (sender, receiver, message) VALUES (?, ?, ?)`);
		stmt.run(message.from, message.target, message.message);
	} catch (err) {
		console.error('Error saving chat history:', err);
	}
}

function handleWebSocketMessageServer(data: string) {
	const message = JSON.parse(data);
	switch (message.type) {
		case 'privateMessage':
			handlePrivateMessage(message);
			break;
		// Add more cases as needed
	}
}

app.get('/ws', { websocket: true }, (socket, req) => { // login received
	console.log('=== WebSocket Handler Called ===');

	// Extract username from query parameters
	const { username } = req.query as { username: string };
	console.log(`User connected: ${username || 'anonymous'}`);

	// Set up message handler
	socket.on('message', (data) => {
		console.log(`✅ Received from ${username}`);
		const strData = data.toString();
		handleWebSocketMessageServer(strData);
	});

	// Handle connection close
	socket.on('close', () => {
		console.log(`User ${username} disconnected`);
	});

	game.sockets.set(username, socket);

	// this is for debugging purposes
	console.log(`----------------------------------------------------------`);
	for (const [key, value] of game.sockets.entries()) {
		console.log(`Socket for ${key}: ${value}`);
	}
	console.log(`----------------------------------------------------------`);
});

app.get('/addFriend', (request, rep) => {
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
	if (game.sockets.has(nameToAdd)) {//this will change into searching in the database
		game.sockets.get(nameToAdd).send(JSON.stringify({// this will change into finding if the user on line
			type: 'friendRequest',
			to: nameToAdd,//b
			from: accountName//a
		}));
		game.sockets.get(nameToAdd).on('message', (data) => {
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
	} else {
		rep.status(202).send({ message: 'Friend request sent' });
	}
});

app.put('/addFriendlist', async (request, reply) => {
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

app.get('/debug/newfriend', async (request, reply) => {
	try {
		const stmt = db.prepare(`SELECT * FROM newFriend`);
		const friends = stmt.all();
		reply.send({ friends });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.get('/getFriendList', async (request, reply) => {
	const { username } = request.query as { username: string };
	if (!username) {
		reply.status(400).send({ error: 'Username is required' });
		return;
	}

	try {
		const stmt = db.prepare(`SELECT friendname FROM newFriend WHERE username = ? AND status = 'accepted'`);
		const rows = stmt.all(username);
		const friends = rows.map(row => row.friendname);
		reply.send({ friendList: friends });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.get(`/debug/chatHistory`, async (request, reply) => {
	try {
		const stmt = db.prepare(`SELECT * FROM chatHistory`);
		const chatHistory = stmt.all();
		reply.send({ chatHistory });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.get(`/getChatHistory`, async (request, reply) => {
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
		const chatHistory = stmt.all(username, friendname, friendname, username);
		const chatHistory1 = chatHistory.map((row) => row.sender + ": " + row.message);
		reply.send({ chatHistory: chatHistory1 });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.get(`/getFriendRequestList`, async (request, reply) => {
	const { username } = request.query as { username: string };
	if (!username) {
		reply.status(400).send({ error: 'Username is required' });
		return;
	}
	try {
		const stmt = db.prepare(`SELECT * FROM newFriend WHERE friendname = ? AND status = 'pending'`);
		const friendRequests = stmt.all(username);
		const friendRequestList = friendRequests.map((row) => row.username);
		reply.send({ friendRequestList });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.get(`/acceptFriendRequest`, async (request, reply) => {
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
		const stmt2 = db.prepare(`INSERT INTO newFriend (username, friendname, status) VALUES (?, ?, 'accepted')`);
		stmt2.run(friendname, username);
		reply.send({ message: `Friend request from ${friendname} accepted` });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
});

app.get(`/rejectFriendRequest`, async (request, reply) => {
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
		game.sockets.get(friendname).send(JSON.stringify({
			type: 'friendRequestResponse',
			from: username,
			response: 'rejected'
		}));
	} else {
		return;
	}
});

app.get(`/getRejectedFriendRequests`, async (request, reply) => {
	const { username } = request.query as { username: string };
	if (!username) {
		reply.status(400).send({ error: 'Username is required' });
		return;
	}

	try {
		const stmt = db.prepare(`SELECT * FROM newFriend WHERE username = ? AND status = 'rejected'`);
		const friendRequests = stmt.all(username);
		const rejectedFriendRequests = friendRequests.map((row) => row.friendname);
		reply.send({ rejectedFriendRequests });
	} catch (err) {
		reply.status(500).send({ error: 'Database error' });
	}
	const stmt2 = db.prepare(`DELETE FROM newFriend WHERE username = ? AND status = 'rejected'`);
	stmt2.run(username);
});

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) throw err;
	console.log(`Server running at ${address}`);
});
