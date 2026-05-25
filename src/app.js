// File: src/app.js
// Deskripsi: Entry point utama aplikasi Express.js. Mengintegrasikan middleware, routing, dan global error handler.

const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

// Import Swagger UI & OpenAPI Specification
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk mem-parsing body request berformat JSON
app.use(express.json());

// Integrasi Swagger UI untuk dokumentasi REST API interaktif
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route beranda (untuk cek status server, opsional)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Tugas REST API Express + Supabase & JWT'
  });
});

// Registrasi Route Utama
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

// Fallback Route untuk endpoint yang tidak terdaftar
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan`
  });
});

// Global Error Handler Middleware
// Setiap error yang diteruskan ke next(err) akan ditangani di sini
app.use((err, req, res, next) => {
  console.error('Error Handler:', err);
  
  // Format response error sesuai plan.md
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal server'
  });
});

// Menjalankan server Express
app.listen(PORT, () => {
  console.log(`Server sedang berjalan secara lokal di http://localhost:${PORT}`);
});

module.exports = app;
