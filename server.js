const express = require("express");
const multer  = require("multer");
const cors    = require("cors");
const path    = require("path");
const fs      = require("fs");

const app  = express();
// Baca PORT dari environment variable (wajib untuk hosting seperti Railway, Render, dll)
const PORT = process.env.PORT || 3000;

// ==================== INIT FOLDER & DB ====================
// Pastikan folder uploads/ dan data/ selalu ada saat server start
const UPLOADS_DIR = path.join(__dirname, "uploads");
const DATA_DIR    = path.join(__dirname, "data");
const DB_PATH     = path.join(DATA_DIR, "files.json");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR))    fs.mkdirSync(DATA_DIR,    { recursive: true });
if (!fs.existsSync(DB_PATH))     fs.writeFileSync(DB_PATH, "[]", "utf8");

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(UPLOADS_DIR));

// ==================== DATABASE ====================
function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); }
  catch { return []; }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

// ==================== MULTER ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf",".doc",".docx",".zip",".rar",".pptx",".ppt",
                     ".xlsx",".xls",".txt",".png",".jpg",".jpeg",".mp4",".mp3"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Format file tidak didukung!"));
  },
});

// ==================== HELPERS ====================
function formatSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileType(filename) {
  if (!filename) return "other";
  const ext = path.extname(filename).toLowerCase();
  const map = {
    ".pdf":"pdf", ".doc":"word", ".docx":"word",
    ".ppt":"ppt", ".pptx":"ppt",
    ".xls":"excel", ".xlsx":"excel",
    ".zip":"zip", ".rar":"zip",
    ".png":"image", ".jpg":"image", ".jpeg":"image",
    ".txt":"text", ".mp4":"video", ".mp3":"audio",
  };
  return map[ext] || "other";
}

// ==================== API ROUTES ====================

// GET /api/files — ambil semua file (support filter & search)
app.get("/api/files", (req, res) => {
  let files = readDB();
  const { q, kategori, sort } = req.query;

  if (q) {
    const keyword = q.toLowerCase();
    files = files.filter(f =>
      f.judul.toLowerCase().includes(keyword) ||
      (f.deskripsi && f.deskripsi.toLowerCase().includes(keyword))
    );
  }
  if (kategori && kategori !== "semua") {
    files = files.filter(f => f.kategori === kategori);
  }
  if (sort === "name") {
    files.sort((a, b) => a.judul.localeCompare(b.judul));
  } else if (sort === "size") {
    files.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));
  }

  res.json({ success: true, data: files });
});

// GET /api/stats — statistik storage
app.get("/api/stats", (req, res) => {
  const files = readDB();
  const totalSize = files.reduce((sum, f) => sum + (f.fileSize || 0), 0);
  const kategoriCount = {};
  files.forEach(f => {
    kategoriCount[f.kategori] = (kategoriCount[f.kategori] || 0) + 1;
  });
  res.json({
    success: true,
    totalFiles: files.length,
    totalSize: formatSize(totalSize),
    totalSizeBytes: totalSize,
    kategoriCount,
  });
});

// POST /api/upload — upload file baru
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    const { judul, kategori, deskripsi } = req.body;
    if (!judul || !kategori) {
      return res.status(400).json({ success: false, message: "Judul dan kategori wajib diisi!" });
    }
    const files = readDB();
    const newFile = {
      id: Date.now(),
      judul,
      kategori,
      deskripsi: deskripsi || "",
      fileName:  req.file ? req.file.originalname : null,
      filePath:  req.file ? "/uploads/" + req.file.filename : null,
      fileSize:  req.file ? req.file.size : 0,
      fileSizeStr: req.file ? formatSize(req.file.size) : "0 B",
      fileType:  req.file ? getFileType(req.file.originalname) : "other",
      waktu:     new Date().toLocaleString("id-ID"),
      createdAt: new Date().toISOString(),
    };
    files.unshift(newFile);
    writeDB(files);
    res.json({ success: true, message: "File berhasil diupload!", data: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Terjadi error: " + err.message });
  }
});

// DELETE /api/files/:id — hapus file (termasuk file fisik)
app.delete("/api/files/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let files = readDB();
  const target = files.find(f => f.id === id);
  if (!target) return res.status(404).json({ success: false, message: "File tidak ditemukan." });

  // Hapus file fisik dari folder uploads
  if (target.filePath) {
    const physicalPath = path.join(__dirname, target.filePath);
    if (fs.existsSync(physicalPath)) fs.unlinkSync(physicalPath);
  }

  files = files.filter(f => f.id !== id);
  writeDB(files);
  res.json({ success: true, message: "File berhasil dihapus." });
});

// PATCH /api/files/:id — rename/edit judul & deskripsi
app.patch("/api/files/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const files = readDB();
  const idx = files.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: "File tidak ditemukan." });

  const { judul, deskripsi, kategori } = req.body;
  if (judul)     files[idx].judul     = judul;
  if (deskripsi !== undefined) files[idx].deskripsi = deskripsi;
  if (kategori)  files[idx].kategori  = kategori;
  writeDB(files);
  res.json({ success: true, message: "File berhasil diupdate.", data: files[idx] });
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log("=========================================");
  console.log("  Personal Drive - WEB PAW TGR");
  console.log("  Running on port: " + PORT);
  console.log("  Local: http://localhost:" + PORT);
  console.log("  Drive: http://localhost:" + PORT + "/drive.html");
  console.log("=========================================");
});
