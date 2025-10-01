import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { findUserByEmailOrUsername, createUser } from '../models/userModel.js';

export async function loginUser(req, res) {
  const { identifier, password } = req.body;
  const user = await findUserByEmailOrUsername(identifier);

  // Ambil baseUrl dari konfigurasi global (didefinisikan di server.js)
  const baseUrl = res.locals.baseUrl || '/energyease';

  if (!user) return res.redirect(`${baseUrl}/login?error=user_not_found`);

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect(`${baseUrl}/login?error=wrong_password`);

  req.session.userId = user.id;
  res.redirect(`${baseUrl}/dashboard`);
}

export async function registerUser(req, res) {
  const { username, email, password } = req.body;
  const baseUrl = res.locals.baseUrl || '/energyease';

  // Cek apakah email sudah ada
  const emailExists = await findUserByEmailOrUsername(email);
  if (emailExists) return res.redirect(`${baseUrl}/register?error=email_exists`);

  // Cek apakah username sudah ada
  const usernameExists = await findUserByEmailOrUsername(username);
  if (usernameExists)
    return res.redirect(`${baseUrl}/register?error=username_exists`);

  const id = `user-${nanoid(16)}`;
  const hashed = await bcrypt.hash(password, 10);
  await createUser(id, username, email, hashed);

  res.redirect(`${baseUrl}/login?success=register_success`);
}
