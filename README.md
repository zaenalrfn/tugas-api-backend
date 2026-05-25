# Tugas REST API Express.js + Supabase & JWT Authentication

Project ini adalah sebuah **REST API** yang dibangun menggunakan **Express.js** dan diintegrasikan dengan database **Supabase (PostgreSQL)**. Untuk sisi pengamanan endpoint, project ini mengimplementasikan autentikasi berbasis **JSON Web Token (JWT)** dan pengamanan password menggunakan **bcryptjs**.

---

## 🚀 Fitur Utama

- **User Registration & Login**: Dilengkapi enkripsi password searah menggunakan `bcryptjs`.
- **JWT Authentication**: Pengamanan rute API menggunakan Bearer Token JWT.
- **Article Management**: Mendapatkan seluruh artikel, artikel secara detail berdasarkan ID, dan membuat artikel baru (memerlukan login).
- **Interactive API Documentation**: Dilengkapi Swagger UI untuk dokumentasi interaktif dan pengujian endpoint secara langsung melalui browser.
- **Global Error Handling**: Menangani error secara tersentralisasi dengan format JSON yang konsisten.

---

## 🛠️ Struktur Project

```text
tugas-api-bakcend/
├── src/
│   ├── config/
│   │   └── supabase.js        # Inisialisasi Supabase Client
│   ├── middlewares/
│   │   └── authMiddleware.js  # Verifikasi Bearer Token JWT
│   ├── controllers/
│   │   ├── authController.js  # Logic Registrasi & Login
│   │   └── articleController.js # Logic CRUD Artikel
│   ├── routes/
│   │   ├── authRoutes.js      # Endpoint Auth
│   │   └── articleRoutes.js   # Endpoint Articles
│   └── app.js                 # Entry Point Express Server
├── .env                       # Variabel Lingkungan (Sensitif)
├── .env.example               # Template Variabel Lingkungan
├── database.sql               # Skema Migrasi Tabel Supabase
└── package.json               # Konfigurasi Dependency & Script Node.js
```

---

## ⚙️ Cara Instalasi & Menjalankan Project

### 1. Klon / Download Repositori Ini
Pastikan Anda sudah berada di dalam folder project ini di terminal Anda.

### 2. Install Dependency
Jalankan perintah berikut untuk mengunduh modul-modul Node.js yang diperlukan:
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env` lalu sesuaikan isinya:
```bash
cp .env.example .env
```
Isi variabel berikut di file `.env`:
```env
PORT=3000
SUPABASE_URL=https://fnlsasxkfsxnxsnubzti.supabase.co
SUPABASE_KEY=sb_publishable_WIhRiT2--6LNixwMaeAXig_pukqkmny
JWT_SECRET=v8mFH4QKbr6SxMUP_super_secret_jwt_key
JWT_EXPIRES_IN=1d
```

### 4. Setup Database di Supabase
1. Masuk ke dashboard project Supabase Anda di **[Supabase Console](https://supabase.com/)**.
2. Pergi ke **SQL Editor**.
3. Salin kode SQL yang ada di file [database.sql](file:///e:/KULIAHKU/SEMESTER%206/PENGEMBANGAN%20APLIKASI%20BACKEND/tugas-api-bakcend/database.sql) dan jalankan (**Run**).

### 5. Jalankan Server Lokal
Untuk mode pengembangan dengan auto-reload (menggunakan nodemon):
```bash
npm run dev
```
Untuk menjalankan secara normal:
```bash
npm start
```
Server akan aktif di: `http://localhost:3000`

### 6. Akses Dokumentasi Swagger UI (Interaktif)
Setelah server berjalan, buka browser Anda dan akses:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

Di halaman ini, Anda dapat langsung mencoba (Try it out) endpoint registrasi, login, pembuatan artikel, dan pengambilan artikel secara langsung menggunakan Bearer Token JWT.

---

## 📡 Panduan & Contoh Penggunaan Endpoint API

### 🔑 1. Autentikasi (Bebas Akses)

#### A. Registrasi Pengguna Baru (`POST /api/auth/register`)
Mendaftarkan akun baru ke sistem.
- **Request Body (JSON):**
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "password": "rahasiaBudi123"
  }
  ```
- **Response Contoh (201 Created):**
  ```json
  {
    "message": "Registrasi berhasil",
    "user": {
      "id": "e4277717-38de-4fae-9d21-4fa35c4bf9bd",
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "created_at": "2026-05-25T12:00:00.000Z"
    }
  }
  ```

#### B. Login Pengguna (`POST /api/auth/login`)
Memverifikasi akun dan mendapatkan Token JWT.
- **Request Body (JSON):**
  ```json
  {
    "email": "budi@example.com",
    "password": "rahasiaBudi123"
  }
  ```
- **Response Contoh (200 OK):**
  ```json
  {
    "message": "Login berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 📝 2. Artikel (Wajib Melampirkan Bearer Token JWT)
Setiap request ke rute artikel harus menyertakan header berikut:
`Authorization: Bearer <TOKEN_JWT_HASIL_LOGIN>`

#### A. Membuat Artikel Baru (`POST /api/articles`) *(Tambahan)*
- **Header:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
  ```json
  {
    "title": "Tutorial Pemrograman Express.js",
    "content": "Express.js adalah web framework minimalis untuk Node.js..."
  }
  ```
- **Response Contoh (201 Created):**
  ```json
  {
    "message": "Artikel berhasil dibuat",
    "data": {
      "id": "f5b6a7c8-d9e0-1f2a-3b4c-5d6e7f8g9h0i",
      "title": "Tutorial Pemrograman Express.js",
      "content": "Express.js adalah web framework minimalis untuk Node.js...",
      "author_id": "e4277717-38de-4fae-9d21-4fa35c4bf9bd",
      "created_at": "2026-05-25T12:10:00.000Z"
    }
  }
  ```

#### B. Mendapatkan Semua Artikel (`GET /api/articles`)
- **Header:** `Authorization: Bearer <token>`
- **Response Contoh (200 OK):**
  ```json
  {
    "message": "Berhasil mendapatkan semua artikel",
    "data": [
      {
        "id": "f5b6a7c8-d9e0-1f2a-3b4c-5d6e7f8g9h0i",
        "title": "Tutorial Pemrograman Express.js",
        "content": "Express.js adalah web framework minimalis untuk Node.js...",
        "author_id": "e4277717-38de-4fae-9d21-4fa35c4bf9bd",
        "created_at": "2026-05-25T12:10:00.000Z"
      }
    ]
  }
  ```

#### C. Mendapatkan Artikel Berdasarkan ID (`GET /api/articles/:id`)
- **Header:** `Authorization: Bearer <token>`
- **Response Contoh (200 OK):**
  ```json
  {
    "message": "Berhasil mendapatkan artikel",
    "data": {
      "id": "f5b6a7c8-d9e0-1f2a-3b4c-5d6e7f8g9h0i",
      "title": "Tutorial Pemrograman Express.js",
      "content": "Express.js adalah web framework minimalis untuk Node.js...",
      "author_id": "e4277717-38de-4fae-9d21-4fa35c4bf9bd",
      "created_at": "2026-05-25T12:10:00.000Z"
    }
  }
  ```

---

## 🚫 Penanganan Error (Error Handling)
Jika terjadi error (misalnya token tidak valid, data tidak ditemukan, dll), sistem akan mengembalikan status code HTTP yang sesuai dengan format respon JSON berikut:
```json
{
  "success": false,
  "message": "Pesan deskripsi kesalahan"
}
```
**Contoh HTTP Status:**
- `401 Unauthorized`: Token tidak disediakan atau format salah.
- `403 Forbidden`: Token telah kedaluwarsa atau tidak valid.
- `404 Not Found`: Halaman atau data artikel tidak ditemukan.
- `500 Internal Server Error`: Masalah koneksi basis data atau kendala internal lainnya.
