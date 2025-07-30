import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error, success: req.query.success });
});

router.get('/register', (req, res) => {
  res.render('register', { error: req.query.error });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Gagal logout:', err);
      return res.redirect('/parameter'); // fallback jika gagal
    }
    res.clearCookie('connect.sid'); // hapus cookie session
    res.redirect('/login?success=Anda telah logout');
  });
});

router.get('/features', (req, res) => res.render('features'));
router.get('/about', (req, res) => res.render('about'));

router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
