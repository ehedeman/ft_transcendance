import { FastifyInstance } from "fastify";
import { db } from "./server.js";

export function parseLocalDateTime(dateTimeString: string): Date {
	const [datePart, timePart] = dateTimeString.split(' ');
	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute, second] = timePart.split(':').map(Number);

	return new Date(year, month - 1, day, hour, minute, second);
}


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

		console.log("📌 Params:", request.params);
		console.log("📌 Alias:", alias);

		try {
			const userRow = db.prepare("SELECT wins, losses FROM users WHERE Full_Name = ?").get(alias) as { wins: number; losses: number } | undefined;
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

				if (m.player1 === alias) {
					score = m.score_player1;
				}
				else if (m.player2 === alias) { //i would need to fix something here...
					score = m.score_player2;
				}
				else {
					score = 0; // This should never be the case...
				}

				const German = parseLocalDateTime(m.match_date);
				const German_time = German.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

				return {
					date: German_time,
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
