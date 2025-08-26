import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';

dotenv.config();

const mqttClient = mqtt.connect(
  `mqtt://${process.env.MQTT_HOST || 'broker.emqx.io'}:1883`
);

const eventEmitter = new EventEmitter();

mqttClient.on('connect', () => {
  console.log('✅ MQTT Dummy Generator connected');
  startGeneratingData();
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT Dummy Generator error:', err);
});

// Fungsi untuk membuat data dummy Tegangan & Arus
const generateDummyData = () => {
  // Parameter yang mirip dengan kondisi riil
  const voltageA = (Math.random() * (225 - 215) + 215).toFixed(2);
  const voltageB = (Math.random() * (225 - 215) + 215).toFixed(2);
  const voltageC = (Math.random() * (225 - 215) + 215).toFixed(2);

  const currentA = (Math.random() * (15 - 1) + 1).toFixed(2);
  const currentB = (Math.random() * (15 - 1) + 1).toFixed(2);
  const currentC = (Math.random() * (15 - 1) + 1).toFixed(2);

  // Parameter lain yang relevan
  const totalPowerFactor = (Math.random() * (1.0 - 0.85) + 0.85).toFixed(2);
  const energyActive = (Math.random() * 100).toFixed(2);
  const energyReactive = (Math.random() * 50).toFixed(2);
  const powerActiveR = (Math.random() * 5000).toFixed(2);
  const powerActiveS = (Math.random() * 5000).toFixed(2);
  const powerActiveT = (Math.random() * 5000).toFixed(2);
  const powerActiveTotal = (
    Number(powerActiveR) +
    Number(powerActiveS) +
    Number(powerActiveT)
  ).toFixed(2);
  const powerReactiveR = (Math.random() * 2000).toFixed(2);
  const powerReactiveS = (Math.random() * 2000).toFixed(2);
  const powerReactiveT = (Math.random() * 2000).toFixed(2);
  const powerReactiveTotal = (
    Number(powerReactiveR) +
    Number(powerReactiveS) +
    Number(powerReactiveT)
  ).toFixed(2);
  const powerApparentR = Math.sqrt(
    Math.pow(powerActiveR, 2) + Math.pow(powerReactiveR, 2)
  ).toFixed(2);
  const powerApparentS = Math.sqrt(
    Math.pow(powerActiveS, 2) + Math.pow(powerReactiveS, 2)
  ).toFixed(2);
  const powerApparentT = Math.sqrt(
    Math.pow(powerActiveT, 2) + Math.pow(powerReactiveT, 2)
  ).toFixed(2);
  const powerApparentTotal = Math.sqrt(
    Math.pow(powerActiveTotal, 2) + Math.pow(powerReactiveTotal, 2)
  ).toFixed(2);
  const powerFactorR = (powerActiveR / powerApparentR).toFixed(2);
  const powerFactorS = (powerActiveS / powerApparentS).toFixed(2);
  const powerFactorT = (powerActiveT / powerApparentT).toFixed(2);

  return {
    voltageA,
    currentA,
    voltageB,
    currentB,
    voltageC,
    currentC,
    totalPowerFactor,
    energyActive,
    energyReactive,
    powerActiveR,
    powerActiveS,
    powerActiveT,
    powerActiveTotal,
    powerReactiveR,
    powerReactiveS,
    powerReactiveT,
    powerReactiveTotal,
    powerApparentR,
    powerApparentS,
    powerApparentT,
    powerApparentTotal,
    powerFactorR,
    powerFactorS,
    powerFactorT,
  };
};

const startGeneratingData = () => {
  setInterval(() => {
    const data = generateDummyData();
    const payload = JSON.stringify(data);
    const topic = 'energyease888/sensor';
    mqttClient.publish(topic, payload, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('❌ Gagal publish data dummy:', error);
      } else {
        console.log(`✅ Berhasil publish data dummy ke topik ${topic}`);
      }
    });
  }, 3000); // Mengirim data setiap 3 detik
};
