-- Skrip Pembuatan Tabel Database (Supabase / PostgreSQL)
-- Jalankan skrip ini di SQL Editor Supabase Anda.

-- Aktifkan ekstensi UUID jika belum aktif
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Hapus tabel jika sudah ada (untuk keperluan reset, opsional)
-- DROP TABLE IF EXISTS articles;
-- DROP TABLE IF EXISTS users;

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel articles
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Penjelasan Kolom:
-- users.id: UUID acak yang di-generate secara otomatis sebagai primary key.
-- users.email: Email pengguna yang unik untuk proses login.
-- users.password: Password pengguna dalam bentuk terenkripsi (hash).
-- articles.author_id: Foreign key yang merujuk ke id pengguna pada tabel users. ON DELETE CASCADE memastikan artikel terhapus jika akun pembuatnya dihapus.
