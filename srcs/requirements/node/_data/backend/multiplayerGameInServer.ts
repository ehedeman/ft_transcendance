import { GameInfo } from "./serverStructures.js";
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export function multiplayerGame(app: FastifyInstance, db: any, game: GameInfo) {
	app.get("/multiplayer", async (req: FastifyRequest, reply: FastifyReply) => {
		const { invitedUser, username } = req.query as { invitedUser: string, username: string };
		if (game.localMode || game.remoteMode || game.multiplayerMode || game.tournamentLoopActive) {
			return reply.status(403).send({ error: 'Game is already in progress' });
		}
		if (game.sockets.has(invitedUser)) {
			const inviteUserSocket = game.sockets.get(invitedUser);
			if (!inviteUserSocket) {
				return reply.status(404).send({ error: "Invited user not connected" });
			}
			inviteUserSocket.send(JSON.stringify({
				type: 'gameInvitation',
				from: username,
				module: 'multiplayer'
			}));

			try {
				const response = await new Promise<{ reply: string }>((resolve, reject) => {
					const timer = setTimeout(() => reject(new Error('No response from invited user')), 30000); // 30s timeout

					const handler = (data: any) => {
						clearTimeout(timer);
						inviteUserSocket.off('message', handler); // remove listener after receiving
						resolve(JSON.parse(data.toString()));
					};

					inviteUserSocket.on('message', handler);
				});

				if (response.reply === 'accept') {
					game.player1.name = username;
					game.player2.name = invitedUser;
					console.log('game is playing between', game.player1.name, 'and', game.player2.name);
					game.remoteMode = true;
					return reply.status(200).send({ message: `Game invitation accepted by ${invitedUser}` });
				} else {
					return reply.status(403).send({ error: 'Game invitation declined' });
				}
			} catch (err: any) {
				return reply.status(408).send({ error: err.message });
			}
		} else {
			reply.status(404).send({ error: "User not found" });
		}
	});
	app.get("/multiplayerGameStart", async (req: FastifyRequest, reply: FastifyReply) => {
		const { username, opponent1, opponent2, opponent3 } = req.query as { username: string, opponent1: string, opponent2: string, opponent3: string };
		if (username && opponent1 && opponent2 && opponent3) {
			game.multiplayerName.push(username, opponent1, opponent2, opponent3);
			game.multiplayerMode = true;
			game.gameFinished = false;
			for (const playerName of game.multiplayerName) {
				if (game.sockets.has(playerName)) {
					const userSocket = game.sockets.get(playerName);
					if (userSocket) {
						userSocket.send(JSON.stringify({
							type: 'multiplayerGameStart',
							play1: username,
							play2: opponent1,
							play3: opponent2,
							play4: opponent3
						}));
					}
				} else {
					return reply.status(404).send({ error: `User ${playerName} not online.` });
				}
			}

			game.player1.name = username;
			game.player2.name = opponent1;
			game.player3.name = opponent2;
			game.player4.name = opponent3;
			return reply.status(200).send({ message: "Multiplayer game started" });
		} else {
			return reply.status(400).send({ error: "Missing parameters" });
		}
	});
}