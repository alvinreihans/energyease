// src/controllers/mqttController.js

import mailer from '../config/mailer.js';
import {
  saveRawSensorData,
  saveHourlySummary,
  getRawSensorDataByHour,
} from '../models/sensorModel.js';
import { getAllUsersEmailAndUsername } from '../models/userModel.js';
import { calculateAverages, calculateIKE } from './utils.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ================================
// VARIABEL GLOBAL DAN PENDINGIN
// ================================
let lastProcessedHour = new Date().getHours();
const NOTIFICATION_COOLDOWN_MS = 30 * 60 * 1000; // 30 menit
let lastIkeAlertTime = 0;

// ================================
// HANDLER PESAN MQTT
// ================================
export const handleMqttMessage = async (io, topic, message) => {
  if (topic === 'energyease888/sensor') {
    try {
      const data = JSON.parse(message.toString());
      const energyActiveNum = Number(data.energyActive);

      // ================================
      // A. AGREGASI DATA PER JAM
      // ================================
      const currentHour = new Date().getHours();
      if (currentHour !== lastProcessedHour) {
        console.log(`[Aggregation] Proses jam ${lastProcessedHour}:00...`);

        const startTime = new Date(new Date().setHours(lastProcessedHour, 0, 0, 0));
        const endTime = new Date(new Date().setHours(lastProcessedHour, 59, 59, 999));

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

      // ================================
      // B. SIMPAN RAW + KIRIM REALTIME
      // ================================
      await saveRawSensorData(data);

      const IKE = calculateIKE(energyActiveNum);
      console.log('[MQTT] Data sensor diterima:', data);
      console.log('[MQTT] Hasil IKE dihitung:', IKE);

      io.emit('sensor-data', data);
      io.emit('IKE', IKE);

      // ================================
      // C. LOGIKA EMAIL NOTIFIKASI
      // ================================
      const currentTime = Date.now();

      if (IKE.status === 'Boros' && currentTime - lastIkeAlertTime > NOTIFICATION_COOLDOWN_MS) {
        console.log(`[IKE Alert] Boros: ${IKE.value}. Kirim notifikasi...`);

        const currentData = {
          energyActive: energyActiveNum.toFixed(2),
          energyReactive: Number(data.energyReactive).toFixed(2),
          totalPowerFactor: Number(data.totalPowerFactor).toFixed(2),
          powerActiveTotal: Number(data.powerActiveTotal).toFixed(2),
          powerReactiveTotal: Number(data.powerReactiveTotal).toFixed(2),
          powerApparentTotal: Number(data.powerApparentTotal).toFixed(2),
        };

        const templatePath = path.join(__dirname, 'templates', 'IKE-alertMail.html');
        let template = '';

        try {
          template = fs.readFileSync(templatePath, 'utf8');
        } catch (fsError) {
          console.error('[Email] Gagal membaca template:', fsError.message);
          return;
        }

        const users = await getAllUsersEmailAndUsername();
        const now = new Date();
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };

        const formattedTime = `${now.toLocaleDateString('id-ID', optionsDate)} pada pukul ${now.toLocaleTimeString('id-ID', optionsTime)} WIB`;

        // ⚡ Pastikan APP_URL selalu punya /energyease di ujungnya
        const appBaseUrl = process.env.APP_URL?.endsWith('/energyease')
          ? process.env.APP_URL
          : `${process.env.APP_URL}/energyease`;

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
            .replace('{{process.env.APP_URL}}', appBaseUrl)
            .replace('{{currentYear}}', new Date().getFullYear());

          return mailer.sendMail({
            from: `"EnergyEase Alert" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `⚠️ Peringatan: Konsumsi Energi Boros! - IKE ${IKE.value}`,
            html,
          });
        });

        await Promise.all(emailPromises)
          .then(() => {
            console.log(`[Email] Berhasil mengirim ${users.length} notifikasi IKE Boros.`);
            lastIkeAlertTime = currentTime;
          })
          .catch((err) => {
            console.error(`[Email] Gagal mengirim notifikasi IKE:`, err.message);
          });
      } else if (IKE.status === 'Boros') {
        const nextAlertTime = new Date(lastIkeAlertTime + NOTIFICATION_COOLDOWN_MS);
        console.log(`[IKE Alert] Masih cooldown. Next alert: ${nextAlertTime.toLocaleTimeString('id-ID')}`);
      }

    } catch (err) {
      console.error('[MQTT] Gagal parsing/simpan data:', err.message);
    }
  }
};
