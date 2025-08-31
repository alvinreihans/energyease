import express from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import { getHourlyData } from '../models/sensorModel.js';

const router = express.Router();

router.get('/history', isLoggedIn, async (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Parameter tanggal diperlukan.' });
  }
  try {
    const data = await getHourlyData(date);
    res.json(data);
  } catch (error) {
    console.error('Gagal mengambil data riwayat:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

export default router;
