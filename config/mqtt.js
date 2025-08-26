import mqtt from 'mqtt';
import { saveSensorData } from '../models/sensorModel.js';

// Konfigurasi koneksi MQTT
const connectUrl = `mqtt://${process.env.MQTT_HOST || 'broker.emqx.io'}:1883`;
const mqttClient = mqtt.connect(connectUrl);

mqttClient.on('connect', () => {
  console.log('✅ MQTT Client connected');
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT Client error:', err);
});

// Tambahkan fungsi ini
const setupMqtt = (io) => {
  mqttClient.subscribe('energyease888/sensor');

  mqttClient.on('message', async (topic, message) => {
    console.log('[MQTT] Message received:', topic, message.toString());
    if (topic === 'energyease888/sensor') {
      try {
        const data = JSON.parse(message.toString());
        await saveSensorData(data); // simpan ke DB
        io.emit('sensor-data', data); // broadcast ke client
      } catch (err) {
        console.error('[MQTT] Gagal parsing / menyimpan:', err.message);
      }
    }
  });
};

export { mqttClient, setupMqtt };
