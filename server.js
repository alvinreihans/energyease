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

// =============================
// Socket.IO + CORS
// =============================
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  path: '/energyease/socket.io/',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// Global Base URL
// =============================
// 🧩 semua EJS akan otomatis tahu kalau base path = /energyease
app.locals.baseUrl = '/energyease';

// =============================
// App Config
// =============================
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

// Middleware global untuk set variabel userId di EJS
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  res.locals.baseUrl = app.locals.baseUrl;
  next();
});

// ✅ Public folder diakses lewat prefix /energyease
app.use('/energyease', express.static(path.join(__dirname, 'public')));

// =============================
// Routes dengan prefix /energyease
// =============================
app.use('/energyease', authRoutes);
app.use('/energyease', dashboardRoutes);
app.use('/energyease/api', apiRoutes);

// =============================
// Testing Mode dengan PIN
// =============================
let testingMode = process.env.TESTING_MODE === 'true';

// API cek status
app.get('/energyease/api/testing-mode', (req, res) => {
  res.json({ testingMode });
});

// API toggle dengan PIN
app.post('/energyease/api/testing-mode/toggle', (req, res) => {
  const { pin } = req.body;

  console.log('📥 PIN diterima dari client:', pin);
  console.log('🔑 PIN seharusnya:', process.env.TESTMODE_PIN);

  if (!pin || pin !== process.env.TESTMODE_PIN) {
    console.log('❌ PIN salah untuk toggle Test Mode');
    return res.status(401).json({ error: 'PIN salah' });
  }

  testingMode = !testingMode;
  io.emit('testing-mode-changed', { testingMode });
  console.log(`⚡ Testing mode sekarang: ${testingMode ? 'AKTIF' : 'NONAKTIF'}`);
  res.json({ testingMode });
});

// =============================
// MQTT + Socket.io
// =============================
setupMqtt(io);

io.on('connection', (socket) => {
  console.log('🔌 Client connected via socket.io:', socket.id);

  // debug semua event masuk
  socket.onAny((event, data) => {
    console.log(`📩 Event dari client: ${event}`, data);
  });

  socket.on('command', ({ deviceId, command }) => {
    const hour = new Date().getHours();

    // Kalau bukan testing mode → tetap batasi jam
    if (!testingMode && hour >= 7 && hour < 18) {
      console.log(`⛔ Command '${command}' for ${deviceId} ditolak (jam terlarang)`);
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

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// =============================
// Start Server
// =============================
const PORT = 4000;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}/energyease`);
  console.log(`⚡ Testing mode: ${testingMode ? 'AKTIF' : 'NONAKTIF'}`);
});
