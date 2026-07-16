const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '..', '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filters
const pdfFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed.'), false);
  }
};

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, or WEBP image files are allowed.'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.pdf', '.docx', '.pptx', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.zip', '.html'];
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}.`), false);
  }
};

// Multer configurations
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB default limit
});

const uploadSinglePdf = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'pdfFile') || req.files.find(f => f.fieldname === 'file') || req.files[0];
      req.file = file;
    }
    next();
  });
};

const uploadMultiplePdfs = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      req.files = req.files.filter(f => f.fieldname === 'pdfFiles' || f.fieldname === 'files');
    }
    next();
  });
};

const uploadSingleImage = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'imageFile') || req.files.find(f => f.fieldname === 'file') || req.files[0];
      req.file = file;
    }
    next();
  });
};

const uploadAny = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0 && !req.file) {
      req.file = req.files[0];
    }
    next();
  });
};

module.exports = {
  uploadSinglePdf,
  uploadMultiplePdfs,
  uploadSingleImage,
  uploadAny
};
