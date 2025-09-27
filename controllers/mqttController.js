// src/controllers/mqttController.js

import mailer from '../config/mailer.js';
import {
  saveRawSensorData,
  saveHourlySummary,
  getRawSensorDataByHour,
} from '../models/sensorModel.js';
import { getAllUsersEmailAndUsername } from '../models/userModel.js';
import { calculateAverages, calculateIKE } from './utils.js';

// --- IMPORT UNTUK PATH FILE (diperlukan untuk membaca template) ---
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Mendapatkan __dirname untuk environment ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- VARIABEL GLOBAL DAN PENDINGIN (COOLDOWN) ---
let lastProcessedHour = new Date().getHours();

// Waktu minimal antar notifikasi (dalam milidetik). Contoh: 30 menit = 1800000 ms
const NOTIFICATION_COOLDOWN_MS = 30 * 60 * 1000;
let lastIkeAlertTime = 0; // Waktu terakhir notifikasi IKE dikirim (timestamp)

// Handler data MQTT
export const handleMqttMessage = async (io, topic, message) => {
  if (topic === 'energyease888/sensor') {
    try {
      const data = JSON.parse(message.toString());

      const energyActiveNum = Number(data.energyActive);

      // ----------------------------------------------------
      // A. MEKANISME AGREGASI DATA PER JAM (JANGAN DIUBAH)
      // ----------------------------------------------------
      const currentHour = new Date().getHours();
      if (currentHour !== lastProcessedHour) {
        console.log(`[Aggregation] Proses jam ${lastProcessedHour}:00...`);

        const startTime = new Date(
          new Date().setHours(lastProcessedHour, 0, 0, 0)
        );
        const endTime = new Date(
          new Date().setHours(lastProcessedHour, 59, 59, 999)
        );

        const rawData = await getRawSensorDataByHour(startTime, endTime);

        if (rawData.length > 0) {
          const avgData = calculateAverages(rawData);
          avgData.startTime = startTime;

          await saveHourlySummary(avgData);
          console.log('[Aggregation] Data per jam berhasil disimpan.');
          io.emit('hourly-data-updated');
        }

        lastProcessedHour = currentHour;
      }

      // ----------------------------------------------------
      // B. SIMPAN RAW DAN KIRIM REAL-TIME
      // ----------------------------------------------------

      // Simpan raw ke DB
      await saveRawSensorData(data);

      // Hitung IKE (Real-time)
      let IKE = calculateIKE(energyActiveNum);
      console.log('[MQTT] Data sensor diterima:', data); // 🔍 log sensor asli
      console.log('[MQTT] Hasil IKE dihitung:', IKE); // 🔍 log hasil IKE

      // Kirim IKE dan data sensor real-time ke dashboard
      io.emit('sensor-data', data);
      io.emit('IKE', IKE);

      // ----------------------------------------------------
      // C. LOGIKA PENDINGIN (COOLDOWN) NOTIFIKASI EMAIL
      // ----------------------------------------------------
      const currentTime = Date.now();

      // Cek apakah IKE boros, DAN waktu pendingin sudah lewat
      if (
        IKE.status === 'Boros' &&
        currentTime - lastIkeAlertTime > NOTIFICATION_COOLDOWN_MS
      ) {
        console.log(
          `[IKE Alert] Terdeteksi Boros: ${IKE.value}. Memulai pengiriman notifikasi.`
        );

        // --- BLOK PENGIRIMAN EMAIL ---
        const currentData = {
          energyActive: energyActiveNum.toFixed(2),
          energyReactive: Number(data.energyReactive).toFixed(2),
          totalPowerFactor: Number(data.totalPowerFactor).toFixed(2),
          powerActiveTotal: Number(data.powerActiveTotal).toFixed(2),
          powerReactiveTotal: Number(data.powerReactiveTotal).toFixed(2),
          powerApparentTotal: Number(data.powerApparentTotal).toFixed(2),
        };

        // Path ke template email (Asumsi: /templates/IKE-alertMail.html)
        const templatePath = path.join(
          __dirname,
          'templates',
          'IKE-alertMail.html'
        );

        let template = '';
        try {
          // Gunakan fs.readFileSync karena ini adalah operasi non-kritis dan lebih sederhana
          template = fs.readFileSync(templatePath, 'utf8');
        } catch (fsError) {
          console.error(
            '[Email] Gagal membaca template IKE-alertMail.html:',
            fsError.message
          );
          // Hentikan proses notifikasi jika template tidak bisa dibaca
          return;
        }

        const users = await getAllUsersEmailAndUsername();

        const now = new Date();
        const optionsDate = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };

        // Format tanggal dan jam dalam bahasa Indonesia
        const formattedTime = `${now.toLocaleDateString(
          'id-ID',
          optionsDate
        )} pada pukul ${now.toLocaleTimeString('id-ID', optionsTime)} WIB`;

        // Map users menjadi Promise untuk mengirim email
        const emailPromises = users.map((user) => {
          const html = template
            .replace('{{username}}', user.username)
            .replace('{{value}}', IKE.value)
            .replace('{{time}}', formattedTime)
            .replace('{{energyActive}}', currentData.energyActive)
            .replace('{{energyReactive}}', currentData.energyReactive)
            .replace('{{totalPowerFactor}}', currentData.totalPowerFactor)
            .replace('{{powerActiveTotal}}', currentData.powerActiveTotal)
            .replace('{{powerReactiveTotal}}', currentData.powerReactiveTotal)
            .replace('{{powerApparentTotal}}', currentData.powerApparentTotal)
            .replace('{{process.env.APP_URL}}', process.env.APP_URL)
            .replace('{{currentYear}}', new Date().getFullYear());

          return mailer.sendMail({
            from: `"EnergyEase Alert" <${process.env.EMAIL_USER}>`,
            to: user.email, // Menggunakan user.email
            subject: `⚠️ Peringatan: Konsumsi Energi Boros! - IKE ${IKE.value}`,
            html: html,
          });
        });

        // Tunggu hingga semua email terkirim
        await Promise.all(emailPromises)
          .then(() => {
            console.log(
              `[Email] Berhasil mengirim ${users.length} notifikasi IKE Boros.`
            );
            // UPDATE WAKTU PENDINGIN HANYA JIKA BERHASIL
            lastIkeAlertTime = currentTime;
          })
          .catch((err) => {
            console.error(
              `[Email] Gagal mengirim notifikasi IKE:`,
              err.message
            );
          });
      } else if (IKE.status === 'Boros') {
        // Logika untuk memberitahu bahwa IKE boros tapi sedang didinginkan
        const nextAlertTime = new Date(
          lastIkeAlertTime + NOTIFICATION_COOLDOWN_MS
        );
        console.log(
          `[IKE Alert] Boros terdeteksi, namun masih dalam cooldown. Next alert: ${nextAlertTime.toLocaleTimeString(
            'id-ID'
          )}`
        );
      }
    } catch (err) {
      console.error('[MQTT] Gagal parsing/simpan data:', err.message);
    }
  }
};
