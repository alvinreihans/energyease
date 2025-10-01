// src/routes/apiRoutes.js
import express from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import { getHourlyData } from '../models/sensorModel.js';

const router = express.Router();

/**
 * GET /energyease/api/history?date=YYYY-MM-DD
 * Mengambil data agregasi energi per jam berdasarkan tanggal
 */
router.get('/history', isLoggedIn, async (req, res) => {
  const { date } = req.query;

  if (!date) {
    console.warn('⚠️ [API] Parameter tanggal tidak diberikan');
    return res.status(400).json({ error: 'Parameter tanggal diperlukan.' });
  }

  try {
    const data = await getHourlyData(date);

    if (!data || data.length === 0) {
      console.log(`[API] Tidak ada data untuk tanggal ${date}`);
      return res.json([]);
    }

    console.log(`[API] Data riwayat berhasil diambil (${data.length} entri)`);
    res.json(data);
  } catch (error) {
    console.error('❌ [API] Gagal mengambil data riwayat:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

export default router;
