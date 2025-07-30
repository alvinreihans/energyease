import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://broker.hivemq.com'); // Ganti ke broker kamu

client.on('connect', () => {
  console.log('🔌 MQTT connected');
  client.subscribe([
    'energyease888/sensor/tegangan',
    'energyease888/sensor/arus',
    'energyease888/sensor/daya',
    'energyease888/sensor/energi',
  ]);
});

const latestData = {
  tegangan: null,
  arus: null,
  daya: null,
  energi: null,
};

client.on('message', (topic, message) => {
  const value = message.toString();

  switch (topic) {
    case 'energyease888/sensor/tegangan':
      latestData.tegangan = value;
      break;
    case 'energyease888/sensor/arus':
      latestData.arus = value;
      break;
    case 'energyease888/sensor/daya':
      latestData.daya = value;
      break;
    case 'energyease888/sensor/energi':
      latestData.energi = value;
      break;
  }
});

export { client, latestData };
