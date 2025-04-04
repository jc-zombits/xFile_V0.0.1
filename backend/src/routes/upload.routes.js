import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processExcel } from '../services/excel/excelParser.js';

// 1. Primero crea el router
const router = express.Router();

// 2. Luego configura multer
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB límite
});

// 3. Finalmente define las rutas
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await processExcel(req.file.path);
    res.status(200).json({ message: 'File processed successfully' });
    
    // Limpieza: eliminar archivo temporal
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Processing failed',
      details: error.message 
    });
  }
});

// 4. Exporta el router configurado
export const uploadRoutes = router;