import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
  })
);

// ⬇️ LETAKKAN DI SINI
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));

// Static files
app.use(express.static('public'));

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
