import express from 'express';
import http from 'http';
import path from 'path';
import session from 'express-session';
import { Server as SocketIO } from 'socket.io';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// import mqttClient from './config/mqtt.js'; // ⬅️ ganti ini
// import { saveSensorData } from './models/sensorModel.js'; // ⬅️ tidak perlu lagi

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { setupMqtt } from './config/mqtt.js'; // ⬅️ import fungsi setupMqtt dari mqtt.js

dotenv.config();

const app = express();
const server = http.createServer(app);
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

// Panggil fungsi setup MQTT
setupMqtt(io); // ⬅️ panggil fungsi dengan objek io

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
