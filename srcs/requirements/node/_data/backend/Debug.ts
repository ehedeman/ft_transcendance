import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt'; // for hashing password
import { saltRounds } from './server.js';

export function debugFunctions(app: FastifyInstance, db: any) {

	app.get('/debug/users', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const stmt = db.prepare(`SELECT id, Full_Name, Alias, avatar_url, Country, status, created_at FROM users`);
			const users = stmt.all();
			reply.send({ users });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get('/debug/tables', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`);
			const tables = stmt.all();
			reply.send({ tables });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.delete('/debug/users/:username', async (request: FastifyRequest, reply: FastifyReply) => {
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
	app.put('/debug/users/:username', async (request: FastifyRequest, reply: FastifyReply) => {
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
	app.put('/debug/users/:username/password', async (request: FastifyRequest, reply: FastifyReply) => {
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

	app.put('/debug/friends', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const stmt = db.prepare(`SELECT id, user_id, friend_id FROM friends`);
			const friends = stmt.all();
			reply.send({ friends });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get('/debug/newfriend', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const stmt = db.prepare(`SELECT * FROM newFriend`);
			const friends = stmt.all();
			reply.send({ friends });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get(`/debug/chatHistory`, async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const stmt = db.prepare(`SELECT * FROM chatHistory`);
			const chatHistory = stmt.all();
			reply.send({ chatHistory });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get('/debug/matchHistory', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const stmt = db.prepare(`SELECT * FROM matchHistory`);
			const matchHistory = stmt.all();
			reply.send({ matchHistory });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get('/debug/cleanTable/newFriend', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			db.prepare(`DELETE FROM newFriend`).run();
			reply.send({ message: `Table 'newFriend' cleaned.` });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});

	app.get('/debug/cleanTable/users', async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			db.prepare(`DELETE FROM users`).run();
			reply.send({ message: `Table 'users' cleaned.` });
		} catch (err) {
			reply.status(500).send({ error: 'Database error' });
		}
	});
}
