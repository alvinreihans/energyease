// src/routes/dashboardRoutes.js
import express from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// =============================
// Rute yang hanya bisa diakses setelah LOGIN
// =============================

// Halaman Dashboard utama
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', {
    baseUrl: '/energyease',
    activePage: 'dashboard',
    userId: req.session.userId,
  });
});

// Halaman Analisis IKE
router.get('/ike', isLoggedIn, (req, res) => {
  res.render('ike', {
    baseUrl: '/energyease',
    activePage: 'ike',
    userId: req.session.userId,
  });
});

// Halaman Control Panel
router.get('/control-panel', isLoggedIn, (req, res) => {
  res.render('controlPanel', {
    baseUrl: '/energyease',
    activePage: 'control',
    userId: req.session.userId,
  });
});

// Halaman History
router.get('/history', isLoggedIn, (req, res) => {
  res.render('history', {
    baseUrl: '/energyease',
    activePage: 'history',
    userId: req.session.userId,
  });
});

export default router;
