import db from '../config/db.js';

export async function saveSensorData({ tegangan, arus, daya, energi }) {
  await db.query(
    'INSERT INTO sensor_data (tegangan, arus, daya, energi) VALUES (?, ?, ?, ?)',
    [tegangan, arus, daya, energi]
  );
}
