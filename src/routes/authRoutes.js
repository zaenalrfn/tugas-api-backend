// File: src/routes/authRoutes.js
// Deskripsi: Definisi routing untuk modul autentikasi (registrasi dan login).

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route Registrasi: POST /api/auth/register
router.post('/register', authController.register);

// Route Login: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
