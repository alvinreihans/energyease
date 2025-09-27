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

  mqttClient.on('message', (topic, message) => {
    handleMqttMessage(io, topic, message);
  });
};

export { mqttClient, setupMqtt };
