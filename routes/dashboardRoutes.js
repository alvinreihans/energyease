import express from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js'; // Import middleware
const router = express.Router();

// Rute yang hanya bisa diakses setelah LOGIN
router.get('/dashboard', isLoggedIn, (req, res) => res.render('dashboard'));
router.get('/ike', isLoggedIn, (req, res) => res.render('ike'));
router.get('/control-panel', isLoggedIn, (req, res) => res.render('controlPanel'));
router.get('/history', isLoggedIn, (req, res) => res.render('history'));

export default router;