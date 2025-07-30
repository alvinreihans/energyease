import express from 'express';
import http from 'http';
import path from 'path';
import session from 'express-session';
import { Server as SocketIO } from 'socket.io';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mqttClient from './config/mqtt.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { saveSensorData } from './models/sensorModel.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ penting agar bisa pakai Socket.IO
const io = new SocketIO(server);

// Path dan view engine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware umum
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rahasia-super-aman',
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware global untuk EJS
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// MQTT Subscribe + Redistribusi ke Socket.IO
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

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
