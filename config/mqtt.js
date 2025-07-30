import mqtt from 'mqtt';

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com'); // atau broker kamu

mqttClient.on('connect', () => {
  console.log('[MQTT] Connected to broker');
});

mqttClient.on('error', (err) => {
  console.error('[MQTT] Connection error:', err);
});

export default mqttClient;
