// src/services/excel/excelUpload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processExcel } from './excelParser.js';

// Configuración mejorada de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos para aceptar solo Excel
const fileFilter = (req, file, cb) => {
  const filetypes = /xlsx|xls/;
  const mimetypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
    files: 1
  }
});

export const configureExcelUpload = (router) => {
  router.post('/upload', upload.single('excelFile'), async (req, res) => {
    let filePath = req.file?.path;
    
    try {
      // Validación adicional del archivo
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No se subió ningún archivo' 
        });
      }

      // Verificar que el archivo existe físicamente
      if (!fs.existsSync(filePath)) {
        throw new Error('El archivo subido no se pudo encontrar en el servidor');
      }

      // Procesar el archivo
      const result = await processExcel(filePath);
      
      // Respuesta exitosa
      res.json({
        success: true,
        totalProcessed: result.totalProcessed,
        totalErrors: result.totalErrors || 0,
        message: result.totalErrors 
          ? `Archivo procesado con ${result.totalErrors} errores (${result.totalProcessed} registros exitosos)`
          : `Archivo procesado exitosamente (${result.totalProcessed} registros)`,
        errors: result.errors // Solo se incluye si hay errores
      });

    } catch (error) {
      console.error('Error en upload:', error);
      
      // Manejo de errores estructurado
      const response = {
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          file: filePath
        } : undefined
      };

      res.status(error.statusCode || 500).json(response);
    } finally {
      // Limpieza garantizada del archivo temporal
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Error al limpiar archivo temporal:', cleanupError);
        }
      }
    }
  });
};