import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error, success: req.query.success });
});

router.get('/register', (req, res) => {
  res.render('register', { error: req.query.error });
});

router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
