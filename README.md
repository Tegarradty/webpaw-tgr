# WEB PAW TGR — Personal Drive

Web personal drive sederhana berbasis **Node.js + Express** dengan frontend HTML/CSS/JS murni.
Fitur utama: upload, preview, download, edit, dan hapus file lewat browser.

---

## 📁 Struktur Folder

```
CODING/
│
├── server.js            # Backend utama — Express server + semua API endpoint
├── package.json         # Konfigurasi npm & daftar dependency
├── package-lock.json    # Lock file dependency (jangan diedit manual)
│
├── drive.html           # Halaman utama My Drive (list file, preview, edit, hapus)
├── upload.html          # Halaman upload file baru
├── index.html           # Redirect otomatis ke drive.html
│
├── style.css            # Semua styling (navbar, drive layout, upload form, modal)
│
├── data/
│   └── files.json       # "Database" JSON — menyimpan metadata file yang diupload
│
├── uploads/             # Folder fisik tempat file yang diupload disimpan
│
└── node_modules/        # Dependency npm (jangan di-commit ke git)
```

---

## 🚀 Cara Menjalankan (Lokal)

### 1. Install dependency
```bash
npm install
```

### 2. Jalankan server
```bash
npm start
# atau
node server.js
```

### 3. Buka browser
```
http://localhost:3000
```
Otomatis redirect ke halaman **My Drive**.

---

## 🌐 Cara Deploy ke Hosting

Project ini siap di-deploy ke platform seperti **Railway**, **Render**, atau **Fly.io**.

### Yang sudah dipersiapkan:
- `server.js` membaca `process.env.PORT` secara otomatis (wajib untuk hosting)
- URL API di frontend menggunakan `window.location.origin` (tidak hardcoded)
- Folder `uploads/` dan `data/` dibuat otomatis saat server start

### Langkah deploy ke Railway (contoh):
1. Push project ke GitHub (pastikan `.gitignore` mengecualikan `node_modules/`)
2. Buat project baru di [railway.app](https://railway.app)
3. Connect ke repo GitHub
4. Railway otomatis mendeteksi `npm start` sebagai start command
5. Selesai — URL hosting langsung bisa dipakai

> **Catatan:** File yang diupload tersimpan di folder `uploads/` di server.
> Jika platform hosting menggunakan **ephemeral storage** (file terhapus saat redeploy),
> pertimbangkan menggunakan layanan cloud storage seperti AWS S3 atau Cloudinary di masa depan.

---

## 🔌 API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/files` | Ambil semua file (support `?q=`, `?kategori=`, `?sort=`) |
| `GET` | `/api/stats` | Statistik storage (jumlah file, total ukuran) |
| `POST` | `/api/upload` | Upload file baru (multipart/form-data) |
| `PATCH` | `/api/files/:id` | Edit judul/kategori/deskripsi file |
| `DELETE` | `/api/files/:id` | Hapus file (dari DB dan disk) |

---

## 📦 Dependency

| Package | Versi | Fungsi |
|---------|-------|--------|
| `express` | ^4.18.2 | Web framework / HTTP server |
| `multer` | ^1.4.5-lts.1 | Handle upload file (multipart) |
| `cors` | ^2.8.5 | Mengizinkan cross-origin request |

---

## 🛠️ Cara Update / Menambah Fitur

### Menambah kategori baru
Edit dua tempat:
1. **`upload.html`** — tambah `<option>` baru di dalam `<select name="kategori">`
2. **`drive.html`** — tambah key baru di `KATEGORI_ICONS` (objek di dalam `<script>`)

### Menambah tipe file yang didukung
Edit dua tempat:
1. **`server.js`** — tambah ekstensi ke array `allowed` di `fileFilter`
2. **`server.js`** — tambah mapping ekstensi ke tipe di `getFileType()`
3. **`drive.html`** — tambah key baru di `FILE_ICONS` untuk tampilan icon & warna
4. **`upload.html`** — tambah ekstensi ke atribut `accept` pada `<input type="file">`

### Mengubah batas ukuran file
Edit di `server.js`:
```js
limits: { fileSize: 100 * 1024 * 1024 }, // Ganti 100 dengan angka MB yang diinginkan
```

### Mengubah tampilan / styling
Semua style ada di `style.css`. File diorganisir dengan komentar bagian:
- `/* ===== NAVBAR ===== */`
- `/* ===== UPLOAD PAGE ===== */`
- `/* DRIVE PAGE */`
- `/* --- MODAL --- */`

---

## ⚠️ Catatan Penting

- **`data/files.json`** adalah "database" sederhana. Jangan hapus file ini atau data file akan hilang.
- **`uploads/`** menyimpan file fisik. Backup folder ini secara berkala.
- Jika ingin menjalankan di port berbeda: `PORT=8080 node server.js`

---

*Dibuat sepenuh hati oleh TGR*
