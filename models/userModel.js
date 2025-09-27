import db from '../config/db.js';

export const findUserByEmailOrUsername = async (identifier) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [identifier, identifier]
  );
  return rows[0];
};

export const createUser = async (id, username, email, hashedPassword) => {
  await db.query(
    'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)',
    [id, username, email, hashedPassword]
  );
};

// Fungsi untuk mengambil seluruh user
export const getAllUsersEmailAndUsername = async () => {
  const [users] = await db.query('SELECT email, username FROM users');
  return users;
};
