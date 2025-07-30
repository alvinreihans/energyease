//HOW TO USE
// INSTALL MQTT ON NPM
// run this command below:
// ~$ node .\mqttDummyGenerator.js

import mqtt from 'mqtt';

const brokerUrl = 'mqtt://broker.hivemq.com';
const client = mqtt.connect(brokerUrl);

// Fungsi untuk generate nilai random
const generateRandom = (min, max, decimal = 2) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimal));
};

// Saat terhubung ke broker
client.on('connect', () => {
  console.log('Terhubung ke broker MQTT');

  // Publish data setiap 2 detik
  setInterval(() => {
    const payload = {
      tegangan: generateRandom(210, 230), // Volt
      arus: generateRandom(0, 10), // Ampere
      daya: generateRandom(0, 2000), // Watt
      energi: generateRandom(0, 50), // kWh
    };

    // Kirim ke tiap topik
    client.publish('energyease888/sensor', JSON.stringify(payload), { qos: 1 });

    console.log('Data terkirim:', JSON.stringify(payload));
  }, 2000);
});

// Error handling
client.on('error', (err) => {
  console.error('MQTT Error:', err);
});
