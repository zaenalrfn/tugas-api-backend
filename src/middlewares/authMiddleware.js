// File: src/middlewares/authMiddleware.js
// Deskripsi: Middleware untuk memverifikasi JSON Web Token (JWT) yang dikirim melalui header Authorization.

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1. Ambil token dari header Authorization: Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 4. Jika tidak ada token → response 401 Unauthorized
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token tidak disediakan'
    });
  }

  // Pisahkan string 'Bearer <token>' untuk mengambil tokennya saja
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token tidak valid'
    });
  }

  // 2. Verifikasi token menggunakan jwt.verify()
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // 5. Jika token invalid/expired → response 403 Forbidden
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Token tidak valid atau telah kedaluwarsa'
      });
    }

    // 3. Jika valid, simpan payload ke req.user dan lanjut ke next()
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
