import db from '../config/db.js';

const lastProcessedHour = 19;

const startTime = new Date(new Date().setHours(lastProcessedHour, 0, 0, 0));
console.log(`startTime : ${startTime}`);

const endTime = new Date(new Date().setHours(lastProcessedHour, 59, 59, 999));
console.log(`endTime : ${endTime}`);

const rawData = await getRawSensorDataByHour(startTime, endTime);

console.log(`rawData : ${rawData}`);

export async function getRawSensorDataByHour(startTime, endTime) {
  const [rows] = await db.query(
    `SELECT * FROM raw_sensor_data 
     WHERE timestamp BETWEEN ? AND ? 
     ORDER BY timestamp ASC`,
    [startTime, endTime]
  );
  console.log(`rows : ${rows}`);
}
