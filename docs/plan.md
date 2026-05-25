Buatkan proyek REST API menggunakan **Express.js** dengan database **Supabase** (PostgreSQL) dan autentikasi menggunakan **JWT (JSON Web Token)**. Berikut kebutuhan lengkapnya:

---

## Stack & Dependency

- Runtime: Node.js
- Framework: Express.js
- Database: Supabase (gunakan @supabase/supabase-js)
- Auth: JWT (jsonwebtoken)
- Password hashing: bcryptjs
- Env management: dotenv
- Validasi opsional: express-validator atau joi

---

## Struktur Folder

Buat struktur seperti ini:

```
project/
├── src/
│   ├── config/
│   │   └── supabase.js        # inisialisasi supabase client
│   ├── middlewares/
│   │   └── authMiddleware.js  # verifikasi JWT
│   ├── controllers/
│   │   ├── authController.js  # register & login
│   │   └── articleController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── articleRoutes.js
│   └── app.js
├── .env
├── .env.example
└── package.json
```

---

## Konfigurasi .env

Buat file `.env.example` dengan variabel berikut:

```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

---

## Tabel Database (Supabase)

Buat SQL untuk 2 tabel berikut di Supabase:

**Tabel `users`:**

- id (uuid, primary key, default gen_random_uuid())
- name (text, not null)
- email (text, unique, not null)
- password (text, not null)
- created_at (timestamptz, default now())

**Tabel `articles`:**

- id (uuid, primary key, default gen_random_uuid())
- title (text, not null)
- content (text, not null)
- author_id (uuid, foreign key → users.id)
- created_at (timestamptz, default now())

---

## Endpoint API

### Auth (tidak butuh token)

- POST /api/auth/register
  - Body: { name, email, password }
  - Hash password dengan bcryptjs sebelum simpan ke Supabase
  - Response: { message, user }

- POST /api/auth/login
  - Body: { email, password }
  - Verifikasi password dengan bcryptjs
  - Buat JWT token dengan payload { id, email }
  - Response: { message, token }

### Articles (WAJIB pakai JWT token)

Semua route articles harus dilindungi middleware JWT.
Header yang dibutuhkan: Authorization: Bearer

- GET /api/articles
  - Tampilkan semua artikel
  - Response: { message, data: [...articles] }

- GET /api/articles/:id
  - Tampilkan satu artikel berdasarkan id
  - Response: { message, data: article }

---

## Middleware JWT (authMiddleware.js)

Buat middleware yang:

1. Ambil token dari header Authorization: Bearer
2. Verifikasi token menggunakan jwt.verify()
3. Jika valid, simpan payload ke req.user dan lanjut ke next()
4. Jika tidak ada token → response 401 Unauthorized
5. Jika token invalid/expired → response 403 Forbidden

---

## Error Handling

Tambahkan global error handler di app.js. Setiap error harus return JSON dengan format:
{
"success": false,
"message": "pesan error"
}

---

## Instruksi Tambahan

- Gunakan async/await untuk semua operasi async
- Jangan simpan password plain text, selalu hash dengan bcrypt
- JWT secret harus diambil dari environment variable, bukan hardcode
- Tambahkan komentar singkat di setiap file untuk menjelaskan fungsinya
- Sertakan contoh request/response di README.md
- Sertakan script SQL untuk membuat tabel di file `database.sql`
