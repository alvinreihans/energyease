import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../models/userModel.js';

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.redirect('/login?error=Email tidak ditemukan');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect('/login?error=Password salah');

  req.session.userId = user.id;
  res.redirect('/');
}

export async function registerUser(req, res) {
  const { email, password } = req.body;
  const existing = await findUserByEmail(email);
  if (existing) return res.redirect('/register?error=Email sudah terdaftar');

  const hashed = await bcrypt.hash(password, 10);
  await createUser(email, hashed);
  res.redirect('/login?success=Berhasil daftar, silakan login');
}
