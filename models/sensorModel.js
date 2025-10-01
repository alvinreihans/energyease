// src/models/sensorModel.js
import db from '../config/db.js';

/**
 * Simpan data mentah dari sensor ke tabel raw_sensor_data
 */
export const saveRawSensorData = async (data) => {
  try {
    const [result] = await db.query(
      `INSERT INTO raw_sensor_data (
        energy_active, energy_reactive, total_power_factor, 
        power_active_total, power_reactive_total, power_apparent_total, 
        voltage_r, current_r, power_active_r, power_reactive_r, power_apparent_r, power_factor_r, 
        voltage_s, current_s, power_active_s, power_reactive_s, power_apparent_s, power_factor_s,
        voltage_t, current_t, power_active_t, power_reactive_t, power_apparent_t, power_factor_t
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.energyActive,
        data.energyReactive,
        data.totalPowerFactor,
        data.powerActiveTotal,
        data.powerReactiveTotal,
        data.powerApparentTotal,
        data.voltageR,
        data.currentR,
        data.powerActiveR,
        data.powerReactiveR,
        data.powerApparentR,
        data.powerFactorR,
        data.voltageS,
        data.currentS,
        data.powerActiveS,
        data.powerReactiveS,
        data.powerApparentS,
        data.powerFactorS,
        data.voltageT,
        data.currentT,
        data.powerActiveT,
        data.powerReactiveT,
        data.powerApparentT,
        data.powerFactorT,
      ]
    );

    // Optional: log ringan untuk debug (hapus bila sudah stabil)
    // console.log(`[DB] Data sensor disimpan (insertId: ${result.insertId})`);
  } catch (error) {
    console.error('❌ [DB Error] Gagal menyimpan data sensor:', error.message);
  }
};

/**
 * Ambil data per jam (hourly_summary) berdasarkan tanggal
 */
export const getHourlyData = async (date) => {
  try {
    const [rows] = await db.query(
      `SELECT * 
       FROM hourly_summary 
       WHERE DATE(start_time) = ? 
       ORDER BY start_time ASC`,
      [date]
    );
    return rows;
  } catch (error) {
    console.error('❌ [DB Error] Gagal mengambil data hourly_summary:', error.message);
    return [];
  }
};

/**
 * Ambil semua data mentah dari raw_sensor_data dalam rentang jam tertentu
 */
export const getRawSensorDataByHour = async (startTime, endTime) => {
  try {
    const [rows] = await db.query(
      `SELECT * 
       FROM raw_sensor_data 
       WHERE timestamp BETWEEN ? AND ? 
       ORDER BY timestamp ASC`,
      [startTime, endTime]
    );
    return rows;
  } catch (error) {
    console.error('❌ [DB Error] Gagal mengambil raw data sensor:', error.message);
    return [];
  }
};

/**
 * Simpan hasil agregasi rata-rata ke tabel hourly_summary
 */
export const saveHourlySummary = async (data) => {
  const {
    startTime,
    avgEnergyActive,
    avgEnergyReactive,
    avgTotalPowerFactor,
    avgPowerActiveTotal,
    avgPowerReactiveTotal,
    avgPowerApparentTotal,
  } = data;

  try {
    await db.query(
      `INSERT INTO hourly_summary (
        start_time,
        avg_energy_active,
        avg_energy_reactive,
        avg_total_power_factor,
        avg_power_active_total,
        avg_power_reactive_total,
        avg_power_apparent_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        startTime,
        avgEnergyActive,
        avgEnergyReactive,
        avgTotalPowerFactor,
        avgPowerActiveTotal,
        avgPowerReactiveTotal,
        avgPowerApparentTotal,
      ]
    );

    // console.log(`[DB] Data agregasi jam ${startTime} disimpan`);
  } catch (error) {
    console.error('❌ [DB Error] Gagal menyimpan data agregasi:', error.message);
  }
};
