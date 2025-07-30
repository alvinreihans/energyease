import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard');
});

router.get('/ike', (req, res) => res.render('ike'));
router.get('/control-panel', (req, res) => res.render('controlPanel'));
router.get('/history', (req, res) => res.render('history'));

export default router;
