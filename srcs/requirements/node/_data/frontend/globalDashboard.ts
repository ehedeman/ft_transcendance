const Chart = (window as any).Chart;
// import { parseLocalDateTime } from "./dashboardRoutes.js";



type LeaderboardItem = {
	alias: string;
	wins: number;
	losses: number;
};

type MatchTypeBreakdown = {
	matchType: string;
	count: number;
};

type RecentMatch = {
	player1: string;
	player2: string;
	winner: string;
	matchType: string;
	match_date: string;
};

type GlobalStats = {
	leaderboard: LeaderboardItem[];
	matchTypeBreakdown: MatchTypeBreakdown[];
	recentMatches: RecentMatch[];
};

// --- Safe DOM selector ---
function getEl<T extends HTMLElement>(id: string): T {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Element with id="${id}" not found`);
	return el as T;
}

// --- Charts ---
export function renderMatchTypeChart(data: MatchTypeBreakdown[]): void {
	const ctx = getEl<HTMLCanvasElement>("globalMatchTypeChart").getContext("2d");
	if (!ctx) return;

	new Chart(ctx, {
		type: "pie",
		data: {
			labels: data.map(d => d.matchType),
			datasets: [{
				data: data.map(d => d.count),
				backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"]
			}]
		},
		options: { responsive: true, plugins: { title: { display: true, text: "Match Types Distribution" } } }
	});
}

// --- Leaderboard Table ---
export function renderLeaderboardTable(leaderboard: LeaderboardItem[]): void {
	const table = getEl<HTMLTableElement>("leaderboardTable");
	table.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Wins</th>
            <th>Losses</th>
        </tr>
    `;

	leaderboard.forEach((player, i) => {
		const row = table.insertRow();
		row.insertCell(0).textContent = `${i + 1}`;
		row.insertCell(1).textContent = player.alias;
		row.insertCell(2).textContent = `${player.wins}`;
		row.insertCell(3).textContent = `${player.losses}`;
	});
}

// --- Recent Matches ---
// export function renderRecentMatches(matches: RecentMatch[]): void {
// 	const list = getEl<HTMLUListElement>("globalRecentMatches");
// 	list.innerHTML = "";
// 	if (!matches.length) list.innerHTML = "<li>No recent matches</li>";

// 	matches.forEach(m => {
// 		const li = document.createElement("li");
// 		li.textContent = `${m.match_date}: ${m.player1} vs ${m.player2} — Winner: ${m.winner} (${m.matchType})`;
// 		list.appendChild(li);
// 	});
// }

export function renderRecentMatches(matches: RecentMatch[]): void {
	const list = getEl<HTMLUListElement>("globalRecentMatches");
	if (!list) return;
	list.innerHTML = "";

	if (!matches.length) {
		list.innerHTML = "<li>No recent matches</li>";
		return;
	}

	const fragment = document.createDocumentFragment();

	matches.forEach(m => {
		const utcString = m.match_date.replace(" ", "T") + "Z"; // "2025-09-04T16:37:42Z" replacing space with T...
		const dateObj = new Date(utcString);
		const germanTime = dateObj.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

		const li = document.createElement("li");
		li.textContent = `${germanTime}: ${m.player1} vs ${m.player2} — Winner: ${m.winner} (${m.matchType})`;
		fragment.appendChild(li); // I need to understand while fragment isn't heavy ont the DOM but list is...
	});

	list.appendChild(fragment);
}


// --- Loader ---
export async function loadGlobalStats(): Promise<void> {
	const globalView = document.getElementById("globalDashboardView") as HTMLDivElement;
	document.getElementById("dashboardButton")!.classList.remove("hidden");
	document.getElementById("globalDashboardButton")!.classList.remove("hidden");
	globalView.classList.remove("hidden");
	try {
		const res = await fetch("/stats/global", { credentials: "include" });
		if (!res.ok) throw new Error("Failed to fetch global stats");

		const data: GlobalStats = await res.json();
		renderMatchTypeChart(data.matchTypeBreakdown);
		renderLeaderboardTable(data.leaderboard);
		renderRecentMatches(data.recentMatches);
	} catch (err) {
		console.error("Global dashboard error:", err);
	}
}

