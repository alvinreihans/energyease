import db from '../config/db.js';

export async function saveSensorData({ tegangan, arus, daya, energi }) {
  await db.query(
    'INSERT INTO sensor_data (tegangan, arus, daya, energi) VALUES ($1, $2, $3, $4)',
    [tegangan, arus, daya, energi]
  );
}
