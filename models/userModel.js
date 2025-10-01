// src/models/userModel.js
import db from '../config/db.js';

/**
 * Cari user berdasarkan email atau username
 */
export const findUserByEmailOrUsername = async (identifier) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1`,
      [identifier, identifier]
    );
    return rows[0];
  } catch (error) {
    console.error('❌ [DB Error] Gagal mencari user:', error.message);
    return null;
  }
};

/**
 * Buat user baru
 */
export const createUser = async (id, username, email, hashedPassword) => {
  try {
    await db.query(
      `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`,
      [id, username, email, hashedPassword]
    );
    // console.log(`[DB] User baru berhasil dibuat: ${username}`);
  } catch (error) {
    console.error('❌ [DB Error] Gagal membuat user baru:', error.message);
  }
};

/**
 * Ambil semua email dan username user untuk pengiriman notifikasi email
 */
export const getAllUsersEmailAndUsername = async () => {
  try {
    const [users] = await db.query(
      `SELECT email, username FROM users ORDER BY username ASC`
    );
    return users;
  } catch (error) {
    console.error('❌ [DB Error] Gagal mengambil daftar user:', error.message);
    return [];
  }
};
