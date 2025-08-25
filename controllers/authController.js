import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../models/userModel.js';

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.redirect('/login?error=email_not_found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect('/login?error=wrong_password');

  req.session.userId = user.id;
  res.redirect('/dashboard');
}

export async function registerUser(req, res) {
  const { email, password } = req.body;
  const existing = await findUserByEmail(email);
  if (existing) return res.redirect('/register?error=email_exists');

  const hashed = await bcrypt.hash(password, 10);
  await createUser(email, hashed);
  res.redirect('/login?success=register_success');
}
