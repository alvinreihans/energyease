import db from '../config/db.js';

export async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return result.rows[0];
}

export async function createUser(email, hashedPassword) {
  await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [
    email,
    hashedPassword,
  ]);
}
