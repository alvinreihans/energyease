import mqtt from 'mqtt';

// Konfigurasi koneksi MQTT
const connectUrl = `mqtt://broker.hivemq.com:1883`;
const topic = 'energyease888/sensor';
const mqttClient = mqtt.connect(connectUrl);

// Fungsi untuk menghasilkan data dummy
const generateDummyData = () => {
  const getRandom = (min, max) =>
    (Math.random() * (max - min) + min).toFixed(2);
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const data = {
    energyActive: getRandom(500, 1500),
    energyReactive: getRandom(100, 400),
    totalPowerFactor: getRandom(0.8, 0.99),

    voltageR: getRandom(220, 230),
    currentR: getRandom(2, 5),
    powerActiveR: getRandom(400, 1000),
    powerReactiveR: getRandom(80, 200),
    powerApparentR: getRandom(450, 1100),
    powerFactorR: getRandom(0.8, 0.99),

    voltageS: getRandom(220, 230),
    currentS: getRandom(2, 5),
    powerActiveS: getRandom(400, 1000),
    powerReactiveS: getRandom(80, 200),
    powerApparentS: getRandom(450, 1100),
    powerFactorS: getRandom(0.8, 0.99),

    voltageT: getRandom(220, 230),
    currentT: getRandom(2, 5),
    powerActiveT: getRandom(400, 1000),
    powerReactiveT: getRandom(80, 200),
    powerApparentT: getRandom(450, 1100),
    powerFactorT: getRandom(0.8, 0.99),
  };

  // Menghitung total daya aktif, reaktif, dan semu
  data.powerActiveTotal =
    parseFloat(data.powerActiveR) +
    parseFloat(data.powerActiveS) +
    parseFloat(data.powerActiveT);
  data.powerReactiveTotal =
    parseFloat(data.powerReactiveR) +
    parseFloat(data.powerReactiveS) +
    parseFloat(data.powerReactiveT);
  data.powerApparentTotal = Math.sqrt(
    Math.pow(data.powerActiveTotal, 2) + Math.pow(data.powerReactiveTotal, 2)
  ).toFixed(2);

  // Normalisasi total power factor
  data.totalPowerFactor = (
    data.powerActiveTotal / data.powerApparentTotal
  ).toFixed(2);

  return data;
};

mqttClient.on('connect', () => {
  console.log('✅ Generator terhubung ke MQTT Broker');

  // Mengirim data setiap 10 detik
  setInterval(() => {
    const data = generateDummyData();
    const payload = JSON.stringify(data);

    mqttClient.publish(topic, payload, { qos: 0, retain: false }, (err) => {
      if (err) {
        console.error('❌ Gagal mempublikasi pesan:', err);
      } else {
        console.log(`Pesan terkirim ke topik ${topic}:`);
        console.log(payload);
        console.log('---');
      }
    });
  }, 10000); // Kirim setiap 10.000 ms (10 detik)
});

mqttClient.on('error', (err) => {
  console.error('❌ Generator mengalami error:', err);
});
