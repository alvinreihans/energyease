import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { findUserByEmailOrUsername, createUser } from '../models/userModel.js';

export async function loginUser(req, res) {
  const { identifier, password } = req.body;
  const user = await findUserByEmailOrUsername(identifier);
  if (!user) return res.redirect('/energyease/login?error=user_not_found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect('/energyease/login?error=wrong_password');

  req.session.userId = user.id;
  res.redirect('/energyease/dashboard');
}

export async function registerUser(req, res) {
  const { username, email, password } = req.body;
  const existing = await findUserByEmailOrUsername(email);

  // Cek apakah email sudah ada
  const emailExists = await findUserByEmailOrUsername(email);
  if (emailExists)
    return res.redirect('/energyease/register?error=email_exists');

  // Cek apakah username sudah ada
  const usernameExists = await findUserByEmailOrUsername(username);
  if (usernameExists)
    return res.redirect('/energyease/register?error=username_exists');

  const id = `user-${nanoid(16)}`;
  const hashed = await bcrypt.hash(password, 10);
  await createUser(id, username, email, hashed);
  res.redirect('/energyease/login?success=register_success');
}
