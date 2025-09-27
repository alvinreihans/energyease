import mqtt from 'mqtt';
import { handleMqttMessage } from '../controllers/mqttController.js';

// Konfigurasi koneksi MQTT
const mqttClient = mqtt.connect(process.env.MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('✅ MQTT Client connected');
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT Client error:', err);
});

// Tambahkan fungsi ini
const setupMqtt = (io) => {
  mqttClient.subscribe('energyease888/sensor');
  mqttClient.subscribe('energyease888/status/#'); // tambahkan untuk status device

  mqttClient.on('message', (topic, message) => {
    if (topic.startsWith('energyease888/status/')) {
      const deviceId = topic.split('/').pop();
      io.emit('device-status', { deviceId, status: message.toString() });
    } else {
      handleMqttMessage(io, topic, message);
    }
  });
};

export { mqttClient, setupMqtt };
