import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import { pool, sequelize } from './config/database.js';
import { presupuestoController } from './domains/controllers/presupuesto.controller.js';
import { configureExcelUpload } from './services/excel/excelUpload.js';

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para form-data
app.use(morgan('dev'));

// Configuración de rutas de Excel
const excelRouter = express.Router();
configureExcelUpload(excelRouter); // Esto añade POST /upload al router

const upload = multer({ dest: 'uploads/' });

// Sincronización de la base de datos
const initDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');
    
    const poolRes = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL (Pool) conectado:', poolRes.rows[0].now);
  } catch (err) {
    console.error('❌ Error de base de datos:', err);
  }
};

// Rutas
app.get('/db-status', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ dbStatus: 'OK', time: rows[0].now });
  } catch (err) {
    res.status(500).json({ dbStatus: 'Error', error: err.message });
  }
});

// Montar el router de Excel
app.use('/api/excel', excelRouter); // Las rutas serán /api/excel/upload

// Rutas de presupuesto (mantenemos las existentes)
app.post('/api/presupuesto/create-table', presupuestoController.createTable);
app.get('/api/presupuesto/summary', presupuestoController.getDataSummary);

app.post('/api/upload-excel', 
  upload.single('excelFile'), // Middleware para procesar el archivo
  presupuestoController.uploadExcel
);

// Ruta de verificación (actualizada)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    endpoints: {
      excelUpload: 'POST /api/excel/upload',
      dbStatus: 'GET /db-status',
      createTable: 'POST /api/presupuesto/create-table',
      summary: 'GET /api/presupuesto/summary'
    }
  });
});

// Inicialización
app.listen(PORT, async () => {
  console.log(`\n✅ Server is running on http://localhost:${PORT}`);
  console.log('✅ Host configurado:', process.env.PG_HOST);
  await initDB();
});