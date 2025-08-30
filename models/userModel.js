import db from '../config/db.js';

export async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return result[0][0];
}

export async function createUser(id, username, email, hashedPassword) {
  await db.query(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [id, username, email, hashedPassword]
  );
}
