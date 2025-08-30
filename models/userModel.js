import db from '../config/db.js';

export async function findUserByEmailOrUsername(identifier) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [identifier, identifier]
  );
  return rows[0];
}

export async function createUser(id, username, email, hashedPassword) {
  await db.query(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [id, username, email, hashedPassword]
  );
}
