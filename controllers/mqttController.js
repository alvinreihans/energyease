import {
  saveRawSensorData,
  saveHourlySummary,
  getRawSensorDataByHour,
} from '../models/sensorModel.js';
import { calculateAverages } from './utils.js';

// let lastProcessedHour = new Date().getHours();
let lastProcessedHour = new Date().getHours();

// Handler data MQTT
export const handleMqttMessage = async (io, topic, message) => {
  if (topic === 'energyease888/sensor') {
    try {
      const data = JSON.parse(message.toString());

      const currentHour = new Date().getHours();
      if (currentHour !== lastProcessedHour) {
        console.log(`[Aggregation] Proses jam ${lastProcessedHour}:00...`);

        // 1. Ambil data mentah dari DB untuk jam sebelumnya
        const startTime = new Date(
          new Date().setHours(lastProcessedHour, 0, 0, 0)
        );
        const endTime = new Date(
          new Date().setHours(lastProcessedHour, 59, 59, 999)
        );

        const rawData = await getRawSensorDataByHour(startTime, endTime);

        if (rawData.length > 0) {
          // 2. Hitung rata-rata
          const avgData = calculateAverages(rawData);
          avgData.startTime = startTime;

          // 3. Simpan ke tabel hourly_summary
          await saveHourlySummary(avgData);
          console.log('[Aggregation] Data per jam berhasil disimpan.');
          io.emit('hourly-data-updated');
        }

        lastProcessedHour = currentHour;
      }

      // Simpan raw ke DB
      await saveRawSensorData(data);

      // Kirim real-time
      io.emit('sensor-data', data);
    } catch (err) {
      console.error('[MQTT] Gagal parsing/simpan:', err.message);
    }
  }
};
