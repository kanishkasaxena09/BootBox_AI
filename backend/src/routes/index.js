const express = require('express');
const router = express.Router();

// Middlewares
const { uploadSinglePdf, uploadMultiplePdfs, uploadSingleImage, uploadAny } = require('../middleware/upload');
const { verifyAdminToken } = require('../middleware/auth');

// Controllers
const careerController = require('../controllers/careerController');
const pdfController = require('../controllers/pdfController');
const calcController = require('../controllers/calcController');
const compressController = require('../controllers/compressController');
const feedbackController = require('../controllers/feedbackController');
const adminController = require('../controllers/adminController');

// --- Career Routes ---
router.post('/career/resume/generate', careerController.generateEnhancedResume);
router.post('/career/resume/pdf', careerController.generateResumePdf);
router.post('/career/ats/check', uploadAny, careerController.checkATS);

// --- PDF Suite Routes ---
router.post('/pdf/merge', uploadMultiplePdfs, pdfController.mergePDFs);
router.post('/pdf/split', uploadSinglePdf, pdfController.splitPDF);
router.post('/pdf/zip-to-pdf', uploadAny, pdfController.zipToPdf);
router.post('/pdf/compress', uploadSinglePdf, pdfController.compressPDF);
router.post('/pdf/watermark', uploadSinglePdf, pdfController.watermarkPDF);
router.post('/pdf/rotate', uploadSinglePdf, pdfController.rotatePDF);
router.post('/pdf/jpg-to-pdf', uploadAny, pdfController.jpgToPdf);
router.post('/pdf/pdf-to-jpg', uploadSinglePdf, pdfController.pdfToJpg);
router.post('/pdf/word-to-pdf', uploadAny, pdfController.docxToPdf);
router.post('/pdf/pdf-to-word', uploadSinglePdf, pdfController.pdfToDocx);
router.post('/pdf/summarizer', uploadSinglePdf, pdfController.summarizePDF);
router.post('/pdf/office-convert', uploadAny, pdfController.officeConverter);

// --- Academic Routes ---
router.get('/academic/config', calcController.getCalcConfig);

// --- Compression Routes ---
router.post('/compress/image', uploadSingleImage, compressController.compressUploadedImage);

// --- Feedback Routes ---
router.post('/feedback', feedbackController.submitFeedback);

// --- Admin Routes ---
router.post('/admin/login', adminController.adminLogin);
router.post('/admin/visitor', adminController.logVisitor);
router.get('/admin/analytics', verifyAdminToken, adminController.getAnalytics);
router.post('/admin/settings', verifyAdminToken, adminController.updateSetting);
router.delete('/admin/feedback/:id', verifyAdminToken, adminController.deleteFeedback);

module.exports = router;
