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

export const saltRounds = 10;

export const app = fastify({ logger: true });

await app.register(websocket);
await app.register(fastifyMultipart);

const pump = promisify(pipeline);

// import path from 'path';
import { fileURLToPath } from 'url';

import { GameInfo, userInfo, loginInfo } from './serverStructures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let game = new GameInfo();


import { mkdirSync } from 'fs';
const dataDir = path.join(__dirname, 'data');
try {
	mkdirSync(dataDir, { recursive: true });
} catch (err) {
	// Directory already exists, ignore
}

export const db = new Database(path.join(__dirname, 'data', 'users.db'));

import { buildDatabase } from './database.js';

buildDatabase(db);

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

export let rounds = 1;

export let accaleration = 0.1; // Speed increase factor

import { updateGame, interactWithGame } from './gamePlayServer.js';

setInterval(() => {
	updateGame();
}, 1000 / 60);
interactWithGame(app, game);



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
			// console.log("Part:", part.type, part.fieldname, part.filename || part.value);
			switch (part.fieldname) {
				case 'name': name = fieldValue; break;
				case 'username': username = fieldValue; break;
				case 'password': password = fieldValue; break;
				case 'country': country = fieldValue; break;
			}
		}
	}

	if (!name || !username || !password || !country) {
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
		reply.send({ status: 200, message: 'User registered successfully', avatar: avatarPath });
	} catch (err: any) {
		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			reply.status(400).send({ status: 400, message: 'User already exists' });
		} else {
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
		console.log(password);
		console.log(id);

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

app.post("/deleteUser", async (request, reply) => {
	const { username } = request.body as { username: string };

	const user = db.prepare("SELECT * FROM users WHERE Alias = ?").get(username);
	if (!user) {
		reply.status(401).send({ status: 401, message: "Invalid username" });
		return;
	}
	db.prepare("DELETE FROM users WHERE Alias = ?").run(username);

	reply.status(200).send({ status: 200, message: "User successfully deleted" });
});


app.post("/logout", async (request, reply) => {
	const { username } = request.body as { username: string };

	const stmt = db.prepare(`SELECT * FROM users WHERE Alias = ?`);
	const user = stmt.get(username) as any;
	if (!user) {
		reply.status(401).send({ status: 401, message: 'Invalid username' });
		return;
	}
	const stmt2 = db.prepare(`UPDATE users SET status = 'offline' WHERE full_name = ?`);//TODO: I add the database changes here
	stmt2.run(username);
	reply.send({ status: 200, message: 'Logout successful', user });
});

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
	const stmt2 = db.prepare(`UPDATE users SET status = 'online' WHERE full_name = ?`);
	stmt2.run(username);
	reply.send({ status: 200, message: 'Login successful', user });
});

import { websocketAndSocketMessage } from './websocketAndSocketMessage.js';

websocketAndSocketMessage(app, db, game);

import { debugFunctions } from "./Debug.js";

debugFunctions(app, db);

import { friendSystem } from './friendSystem.js';

friendSystem(app, db, game);

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) throw err;
	console.log(`Server running at ${address}`);
});
