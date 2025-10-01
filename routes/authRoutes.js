// src/routes/authRoutes.js
import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { isLoggedOut } from '../middleware/authMiddleware.js';

const router = express.Router();

// =============================
// Halaman Publik (tidak butuh login)
// =============================
router.get('/', (req, res) => {
  res.render('guest/welcome', { baseUrl: '/energyease' });
});

router.get('/features', (req, res) =>
  res.render('guest/features', { baseUrl: '/energyease' })
);

router.get('/about', (req, res) =>
  res.render('guest/about', { baseUrl: '/energyease' })
);

// =============================
// Halaman Login & Register (hanya bisa diakses jika belum login)
// =============================
router.get('/login', isLoggedOut, (req, res) => {
  console.log('🧭 [AUTH] GET /login');
  res.render('guest/login', {
    baseUrl: '/energyease',
    error: req.query.error,
    success: req.query.success,
  });
});

router.get('/register', isLoggedOut, (req, res) => {
  console.log('🧭 [AUTH] GET /register');
  res.render('guest/register', {
    baseUrl: '/energyease',
    error: req.query.error,
  });
});

router.post('/login', async (req, res) => {
  console.log('📥 [AUTH] POST /login');
  await loginUser(req, res);
});

router.post('/register', async (req, res) => {
  console.log('📥 [AUTH] POST /register');
  await registerUser(req, res);
});

// =============================
// Logout (hanya bisa diakses setelah login)
// =============================
router.get('/logout', (req, res) => {
  console.log('🚪 [AUTH] User logout diproses');
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/energyease/login?success=logout_success');
  });
});

export default router;
