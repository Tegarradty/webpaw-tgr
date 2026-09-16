# WEB PAW TGR — Personal Drive

Web personal drive sederhana berbasis **HTML + CSS + JavaScript murni** (tanpa server/backend).
File disimpan di **localStorage browser**. Bisa di-hosting di GitHub Pages secara gratis.

🌐 **Live:** [pawpaw.click](https://pawpaw.click)
📁 **Repo:** [github.com/Tegarradty/webpaw-tgr](https://github.com/Tegarradty/webpaw-tgr)

---

## 📁 Struktur Folder

```
webpaw-tgr/
│
├── drive.html      # Halaman utama My Drive (list, preview, edit, hapus file)
├── upload.html     # Halaman upload file baru
├── index.html      # Redirect otomatis ke drive.html
├── style.css       # Semua styling (navbar, drive, upload form, modal)
│
├── .gitignore      # File yang diabaikan Git
└── README.md       # Dokumentasi ini
```

> ⚠️ Tidak ada `server.js` — project ini **100% static**, tidak butuh Node.js untuk jalan.

---

## 🚀 Cara Buka di Lokal (Tanpa Install Apapun)

Cukup buka file langsung di browser:
```
Klik 2x → drive.html
```
Atau pakai ekstensi **Live Server** di VS Code untuk auto-refresh.

---

## ✏️ Cara Update / Ubah Kode

Setiap kali kamu ubah file (HTML/CSS/JS), jalankan **3 perintah ini** di PowerShell:

```powershell
git add .
git commit -m "update: tulis apa yang kamu ubah"
git push
```

GitHub Pages otomatis deploy ulang dalam **~1-2 menit**. Selesai! ✅

### Contoh pesan commit yang bagus:
```powershell
git commit -m "tambah kategori: Matematika"
git commit -m "fix: perbaiki tampilan di HP"
git commit -m "update: ganti warna navbar"
```

---

## 🗂️ Cara Kerja Penyimpanan (localStorage)

| Fitur | Cara Kerja |
|-------|-----------|
| Upload file | File dibaca sebagai base64 lalu disimpan di `localStorage` browser |
| Lihat file | Dibaca dari `localStorage` dan ditampilkan |
| Download | Dibuat dari data base64 yang tersimpan |
| Hapus | Dihapus dari `localStorage` |

**Key localStorage:** `webpaw_files` (array JSON)

> ⚠️ **Batasan:** File hanya tersimpan di browser yang dipakai upload. Buka dari HP/browser lain = kosong. Batas ukuran file ~5MB per file.

---

## 🛠️ Cara Menambah Fitur

### Tambah kategori baru
Edit di **2 tempat**:

1. `upload.html` — tambah `<option>` baru:
```html
<option value="NamaKategori">Nama Kategori Tampilan</option>
```

2. `drive.html` — tambah di objek `KATEGORI_ICONS`:
```js
"NamaKategori": "&#128218;",  // ganti emoji sesuai selera
```

### Tambah tipe file baru
Edit di **2 tempat** di `drive.html`:

1. Objek `FILE_ICONS` — tambah tampilan icon & warna
2. Fungsi `getFileType()` di `upload.html` — tambah mapping ekstensi

### Ubah batas ukuran file
Di `upload.html`, baris:
```js
const MAX_FILE_SIZE = 5 * 1024 * 1024; // ganti 5 dengan MB yang diinginkan
```

### Ubah tampilan / warna
Semua ada di `style.css`, diorganisir dengan komentar:
- `/* NAVBAR */`
- `/* UPLOAD PAGE */`
- `/* DRIVE PAGE */`
- `/* MODAL */`

---

## 🌐 Info Hosting

| Item | Detail |
|------|--------|
| Platform | GitHub Pages (gratis) |
| Domain | pawpaw.click (Hostinger) |
| DNS | 4x A record → IP GitHub Pages |
| HTTPS | Otomatis dari GitHub Pages |

### Kalau mau ganti domain:
1. GitHub → Settings → Pages → Custom domain → ganti domain
2. DNS provider → update A record ke IP baru

---

## 🔄 Alur Kerja Sehari-hari

```
Edit kode di PC
      ↓
git add . && git commit -m "..." && git push
      ↓
GitHub Pages auto-deploy (~1-2 menit)
      ↓
pawpaw.click langsung terupdate ✅
```

---

*Dibuat sepenuh hati oleh TGR* 🚀
