import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { pool, sequelize } from './config/database.js'; // Importación unificada
import presupuestoController from './domains/controllers/presupuesto.controller.js';


dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sincronización de la base de datos
const initDB = async () => {
  try {
    await sequelize.sync({ alter: true }); // Usar { force: true } solo en desarrollo si necesitas recrear tablas
    console.log('✅ Tablas sincronizadas');
    
    // Verificación de conexión con pool
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

app.post('/api/presupuesto/create-table', presupuestoController.createTable);
app.post('/api/presupuesto/upload', presupuestoController.uploadData);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Inicialización
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  await initDB(); // Inicializar DB después de levantar el servidor
});

console.log('Host configurado:', process.env.PG_HOST);