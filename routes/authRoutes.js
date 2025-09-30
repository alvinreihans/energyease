import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { isLoggedOut } from '../middleware/authMiddleware.js'; // Import middleware
const router = express.Router();

// Rute yang bisa diakses oleh siapa saja
router.get('/', (req, res) => {
  res.render('guest/welcome');
});

router.get('/features', (req, res) => res.render('guest/features'));
router.get('/about', (req, res) => res.render('guest/about'));

// Rute yang hanya bisa diakses saat BELUM login
router.get('/login', isLoggedOut, (req, res) => {
  res.render('guest/login', {
    error: req.query.error,
    success: req.query.success,
  });
});

router.get('/register', isLoggedOut, (req, res) => {
  res.render('guest/register', { error: req.query.error });
});

router.post('/login', loginUser);
router.post('/register', registerUser);

// Rute logout, bisa diakses oleh user yang sudah login
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login?success=logout_success');
  });
});

export default router;
