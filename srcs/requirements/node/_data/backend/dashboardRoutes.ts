import { FastifyInstance } from "fastify";
import { db } from "./server.js";

type MatchHistoryItem = {
	date: string;
	opponent: string;
	result: "Win" | "Loss";
	score: number;
};

type UserStatsResponse = {
	wins: number;
	losses: number;
	matches: MatchHistoryItem[];
};

export async function dashboardRoutes(app: FastifyInstance) {
	app.get("/user/:alias/stats", { preHandler: [app.authenticate] }, async (request, reply) => {
		const alias = (request.params as { alias: string }).alias;

		try {
			const userRow = db.prepare("SELECT wins, losses FROM users WHERE Alias = ?").get(alias) as { wins: number; losses: number } | undefined;
			if (!userRow) return reply.status(404).send({ message: "User not found" });

			const matchesRows = db.prepare(`
                SELECT * FROM matchHistory 
                WHERE player1 = ? OR player2 = ? 
                ORDER BY match_date DESC LIMIT 10
            `).all(alias, alias);

			let score: number;
			const matches: MatchHistoryItem[] = matchesRows.map((m: any) => {
				const opponent = m.player1 === alias ? m.player2 : m.player1; // tenary if/else
				const result: "Win" | "Loss" = m.winner === alias ? "Win" : "Loss";

				if (m.winner === alias) {
					score = m.score_player1;
				}
				else {
					score = m.score_player2; // This should never be the case... 
				}
				return {
					date: m.match_date,
					opponent,
					result,
					score
				};
			});

			const response: UserStatsResponse = {
				wins: userRow.wins,
				losses: userRow.losses,
				matches
			};

			reply.send(response);
		} catch (err) {
			console.error(err);
			reply.status(500).send({ message: "Server error" });
		}
	});
}
