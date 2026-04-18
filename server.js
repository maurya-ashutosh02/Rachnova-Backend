require('dotenv').config();

if (!process.env.MONGODB_URI) {
  console.error('\n❌  MONGODB_URI not set! Add it to your environment variables.\n');
  process.exit(1);
}

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
const connectDB = require('./config/db');

const app = express();
connectDB();

// Uploads dir for local fallback
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow: no origin (Postman/curl), any *.vercel.app, localhost dev
    if (
      !origin ||
      /\.vercel\.app$/.test(origin) ||
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:3000' ||
      origin === process.env.CLIENT_URL
    ) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Request logger ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms  = Date.now() - start;
    const col = res.statusCode >= 400 ? '\x1b[31m'
              : res.statusCode >= 300 ? '\x1b[33m'
              : '\x1b[32m';
    console.log(`${col}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/content',   require('./routes/content'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api',           require('./routes/misc'));
app.use('/api',           require('./routes/interactions'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Rachnova API running 🚀',
    env: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL || 'not set',
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Rachnova Server running on port ${PORT}`);
  console.log(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CLIENT_URL: ${process.env.CLIENT_URL || 'not set (all vercel.app domains allowed)'}\n`);
});

module.exports = app;