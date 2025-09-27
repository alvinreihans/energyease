import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import session from 'express-session';
import { Server as SocketIO } from 'socket.io';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { setupMqtt, mqttClient } from './config/mqtt.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/api', apiRoutes);

setupMqtt(io);
io.on('connection', (socket) => {
  console.log('🔌 Client connected via socket.io');

  // Listen perintah dari browser
  socket.on('command', ({ deviceId, command }) => {
    const hour = new Date().getHours();

    // Restriction jam 07–18
    if (hour >= 7 && hour < 18) {
      console.log(
        `⛔ Command '${command}' for ${deviceId} ditolak (jam terlarang)`
      );
      socket.emit('command-rejected', {
        deviceId,
        command,
        reason: 'Kontrol tidak tersedia pada jam 07.00 - 18.00',
      });
      return;
    }

    // Publish ke MQTT
    const topic = `energyease888/command/${deviceId}`;
    mqttClient.publish(topic, command);
    console.log(`📤 Command '${command}' sent to ${topic}`);

    // 👉 Hanya simulasi status kalau device adalah AC
    if (deviceId.startsWith('ac')) {
      mqttClient.publish(`energyease888/status/${deviceId}`, command);
    }
  });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
