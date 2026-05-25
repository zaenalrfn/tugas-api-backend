// File: src/app.js
// Deskripsi: Entry point utama aplikasi Express.js. Mengintegrasikan middleware, routing, dan global error handler.

const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

const swaggerDocument = require('./config/swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk mem-parsing body request berformat JSON
app.use(express.json());

// Endpoint untuk menyajikan spesifikasi swagger.json murni
app.get('/api/docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Integrasi Swagger UI interaktif menggunakan CDN (Menghindari error bundling Vercel & trailing slash)
app.get('/api-docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>ArticleAPI Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@4.15.5/favicon-32x32.png" sizes="32x32" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #0f172a; }
    .swagger-ui { background-color: #0f172a; color: #f1f5f9; }
    .swagger-ui .topbar { background-color: #020617; border-bottom: 1px solid #1e293b; }
    .swagger-ui .info .title { color: #f1f5f9 !important; }
    .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info td, .swagger-ui .info a { color: #94a3b8 !important; }
    .swagger-ui .scheme-container { background: #1e293b !important; box-shadow: none !important; border-top: 1px solid #334155; }
    .swagger-ui select { background: #334155 !important; color: #f1f5f9 !important; border: 1px solid #475569 !important; }
    .swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-description { color: #f1f5f9 !important; }
    .swagger-ui .opblock-tag { color: #f1f5f9 !important; border-bottom: 1px solid #334155 !important; }
    .swagger-ui .dialog-ux .modal-ux { background-color: #1e293b !important; border: 1px solid #475569 !important; }
    .swagger-ui .dialog-ux .modal-ux-header { border-bottom: 1px solid #334155 !important; }
    .swagger-ui .dialog-ux .modal-ux-header h3 { color: #f1f5f9 !important; }
    .swagger-ui .dialog-ux .modal-ux-content h4 { color: #94a3b8 !important; }
    .swagger-ui .btn { color: #f1f5f9 !important; border-color: #475569 !important; background-color: #334155 !important; }
    .swagger-ui .btn.authorize { background-color: #6366f1 !important; border-color: #6366f1 !important; color: #fff !important; }
    .swagger-ui .btn.authorize svg { fill: #fff !important; }
    .swagger-ui .auth-btn-wrapper .authorize { color: #fff !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "/api/docs-json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Route beranda (untuk cek status server & dokumentasi)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to REST API Express.js + Supabase & JWT. Dokumentasi API interaktif tersedia di /api-docs'
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
