import { FastifyInstance, FastifyRequest } from 'fastify';
import { GameInfo } from './serverStructures';

export function websocketAndSocketMessage(app: FastifyInstance, db: any, game: GameInfo) {
	function handlePrivateMessage(message: any) {
		const targetSocket = game.sockets.get(message.target);
		const stmt2 = db.prepare('SELECT status FROM newFriend WHERE username = ? AND friendname = ?');
		let status = stmt2.get(message.target, message.from)?.status;
		if (!status) {
			status = stmt2.get(message.from, message.target)?.status;
		}
		console.log(`Friend status between ${message.from} and ${message.target}: ${status}`);
		if (targetSocket && status === 'accepted') {
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

	app.get('/ws', { websocket: true }, (socket, req: FastifyRequest) => { // login received
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
			const stmt2 = db.prepare(`UPDATE users SET status = 'offline' WHERE full_name = ?`);//TODO: I add the database changes here
			stmt2.run(username);
			game.sockets.delete(username);
		});

		game.sockets.set(username, socket);

		// this is for debugging purposes
		console.log(`----------------------------------------------------------`);
		for (const [key, value] of game.sockets.entries()) {
			console.log(`Socket for ${key}: ${value}`);
		}
		console.log(`----------------------------------------------------------`);
	});
}