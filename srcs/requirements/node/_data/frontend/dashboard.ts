// Chart.js is loaded via CDN in index.html
const Chart = (window as any).Chart;

export type Match = {
	date: string;
	opponent: string;
	result: "Win" | "Loss";
	score: number;
};

export type UserStats = {
	wins: number;
	losses: number;
	matches: Match[];
};

// --- Utility: Safe DOM access ---
function getEl<T extends HTMLElement>(id: string): T {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Element with id="${id}" not found`);
	return el as T;
}

// --- Render functions ---
function renderPieChart(wins: number, losses: number): void {
	const ctx = getEl<HTMLCanvasElement>("matchPieChart").getContext("2d");
	if (!ctx) return;

	new Chart(ctx, {
		type: "pie",
		data: {
			labels: ["Wins", "Losses"],
			datasets: [{
				data: [wins, losses],
				backgroundColor: ["#4CAF50", "#F44336"],
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: { position: "bottom" },
				title: { display: true, text: "Win vs. Loss Distribution" }
			}
		}
	});
}

function renderBarChart(matches: Match[]): void {
	const ctx = getEl<HTMLCanvasElement>("matchBarChart").getContext("2d");
	if (!ctx) return;

	const labels = matches.map((_, i) => `Game ${i + 1}`);
	const scores = matches.map(m => m.score);

	new Chart(ctx, {
		type: "bar",
		data: {
			labels,
			datasets: [{
				label: "Score",
				data: scores,
				backgroundColor: "#ab1a9cff"
			}]
		},
		options: {
			responsive: true,
			scales: { y: { beginAtZero: true } },
			plugins: { title: { display: true, text: "Recent Match Scores" } }
		}
	});
}

function renderMatchHistoryList(matches: Match[]): void {
	const list = getEl<HTMLUListElement>("dashboardMatchHistoryList");
	list.innerHTML = "";

	if (!matches.length) {
		list.innerHTML = "<li>No matches played yet.</li>";
		return;
	}

	matches.forEach(match => {
		const li = document.createElement("li");
		li.textContent = `${match.date}: ${match.opponent} — ${match.result} (${match.score})`;
		list.appendChild(li);
	});
}

// --- Load Dashboard ---
export async function loadUserDashboard(alias: string): Promise<void> {
	document.getElementById("dashboardButton")!.classList.remove("hidden");
	document.getElementById("globalDashboardButton")!.classList.remove("hidden");
	document.getElementById("dashboardView")!.classList.remove("hidden");	
	try {
		const res = await fetch(`/user/${alias}/stats`, { credentials: "include" });
		if (!res.ok) throw new Error("Failed to fetch dashboard data");

		const data: UserStats = await res.json();
		renderPieChart(data.wins, data.losses);
		renderBarChart(data.matches); // I need change here to reflex an individual's score and not the end match result
		renderMatchHistoryList(data.matches);
	} catch (err) {
		console.error("Dashboard error:", err);
	}
}

