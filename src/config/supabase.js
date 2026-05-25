// File: src/config/supabase.js
// Deskripsi: Inisialisasi dan konfigurasi Supabase client untuk berinteraksi dengan database.

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validasi bahwa environment variable sudah dikonfigurasi dengan benar
if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: SUPABASE_URL atau SUPABASE_KEY belum terdefinisi di file .env');
  process.exit(1);
}

// Inisialisasi Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
