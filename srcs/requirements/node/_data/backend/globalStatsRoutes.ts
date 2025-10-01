import { FastifyInstance } from "fastify";
import { db } from "./server.js";


type LeaderboardItem = {
	alias: string;
	wins: number;
	losses: number;
};

type MatchTypeBreakdown = {
	matchType: string;
	count: number;
};

type GlobalStatsResponse = {
	leaderboard: LeaderboardItem[];
	matchTypeBreakdown: MatchTypeBreakdown[];
	recentMatches: {
		player1: string;
		player2: string;
		winner: string;
		matchType: string;
		match_date: string;
	}[];
};

export async function globalStatsRoutes(app: FastifyInstance) {
	app.get("/stats/global", { preHandler: [app.authenticate] }, async (request, reply) => {
		try {
			// Leaderboard: Top 10 players by wins
			const leaderboard = db.prepare(`
                SELECT Alias as alias, wins, losses 
                FROM users 
                ORDER BY wins DESC 
                LIMIT 10
            `).all() as LeaderboardItem[];

			// Match type breakdown
			const matchTypeBreakdown = db.prepare(`
                SELECT matchType as matchType, COUNT(*) as count 
                FROM matchHistory 
                GROUP BY matchType
            `).all() as MatchTypeBreakdown[];

			// Recent global matches (last 10)
			const recentMatches = db.prepare(`
                SELECT player1, player2, winner, matchType, match_date 
                FROM matchHistory 
                ORDER BY match_date DESC 
                LIMIT 10
            `).all() as {
				player1: string;
				player2: string;
				winner: string;
				matchType: string;
				match_date: string;
			}[];

			const response: GlobalStatsResponse = {
				leaderboard,
				matchTypeBreakdown,
				recentMatches
			};

			reply.send(response);
		} catch (err) {
			console.error(err);
			reply.status(500).send({ message: "Server error" });
		}
	});
}


