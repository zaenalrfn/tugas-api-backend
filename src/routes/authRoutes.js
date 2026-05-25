// File: src/routes/authRoutes.js
// Deskripsi: Definisi routing untuk modul autentikasi (registrasi dan login).

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route Registrasi: POST /api/auth/register
router.post('/register', authController.register);

// Route Login: POST /api/auth/login
router.post('/login', authController.login);

// Route Logout: POST /api/auth/logout (Wajib pakai token JWT)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
