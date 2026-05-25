// File: src/routes/articleRoutes.js
// Deskripsi: Definisi routing untuk modul artikel. Semua route dilindungi oleh authMiddleware.

const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua route di bawah ini memerlukan header Authorization: Bearer <token>
router.use(authMiddleware);

// GET /api/articles -> Mendapatkan semua artikel
router.get('/', articleController.getArticles);

// GET /api/articles/:id -> Mendapatkan satu artikel berdasarkan id
router.get('/:id', articleController.getArticleById);

// POST /api/articles -> Membuat artikel baru
router.post('/', articleController.createArticle);

module.exports = router;
