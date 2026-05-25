// File: src/controllers/authController.js
// Deskripsi: Controller untuk menangani alur registrasi pengguna baru dan login dengan verifikasi hash password (bcrypt) serta penandatanganan JWT.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
require('dotenv').config();

/**
 * Register User Baru
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, dan password wajib diisi'
      });
    }

    // Cek apakah email sudah terdaftar di database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      return next(checkError);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password dengan bcryptjs sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user ke Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select('id, name, email, created_at')
      .single();

    if (insertError) {
      return next(insertError);
    }

    // Return response sukses dengan data user baru (tanpa password)
    return res.status(201).json({
      message: 'Registrasi berhasil',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (findError) {
      return next(findError);
    }

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Verifikasi password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Buat JWT token dengan payload { id, email }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Return response sukses berupa token JWT
    return res.status(200).json({
      message: 'Login berhasil',
      token
    });
  } catch (error) {
    next(error);
  }
};
