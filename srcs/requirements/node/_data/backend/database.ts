import type { Database as DatabaseType } from 'better-sqlite3';

export function buildDatabase(db: DatabaseType) {
	db.exec(`
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	Full_Name TEXT UNIQUE NOT NULL,
	Alias TEXT UNIQUE NOT NULL,
	Country TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	avatar_url TEXT DEFAULT './avatars/default-avatar.png',
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
}