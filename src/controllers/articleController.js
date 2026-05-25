// File: src/controllers/articleController.js
// Deskripsi: Controller untuk mengelola artikel, seperti menampilkan seluruh artikel, menampilkan artikel berdasarkan ID, dan membuat artikel baru (memerlukan autentikasi).

const supabase = require('../config/supabase');

/**
 * Mendapatkan Semua Artikel
 * GET /api/articles
 */
exports.getArticles = async (req, res, next) => {
  try {
    // Mengambil seluruh artikel dari tabel articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return next(error);
    }

    return res.status(200).json({
      message: 'Berhasil mendapatkan semua artikel',
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mendapatkan Artikel berdasarkan ID
 * GET /api/articles/:id
 */
exports.getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Mengambil satu artikel berdasarkan ID
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return next(error);
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    return res.status(200).json({
      message: 'Berhasil mendapatkan artikel',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Membuat Artikel Baru (Rekomendasi Tambahan)
 * POST /api/articles
 */
exports.createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const author_id = req.user.id; // Diambil dari token JWT hasil authMiddleware

    // Validasi input dasar
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title dan content wajib diisi'
      });
    }

    // Menyisipkan artikel baru ke dalam database Supabase
    const { data: newArticle, error } = await supabase
      .from('articles')
      .insert([{ title, content, author_id }])
      .select('*')
      .single();

    if (error) {
      return next(error);
    }

    return res.status(201).json({
      message: 'Artikel berhasil dibuat',
      data: newArticle
    });
  } catch (error) {
    next(error);
  }
};
