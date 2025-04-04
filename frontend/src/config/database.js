import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { presupuestoModel } from '../domains/controllers/presupuesto.model.js';

const { Pool } = pkg;
dotenv.config();

// Configuración de Pool (pg)
export const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432,
});

// Configuración de Sequelize
export const sequelize = new Sequelize({
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  dialect: 'postgres',
  logging: false, // Desactiva logs de SQL en consola
});

// Test de conexiones
const testConnections = async () => {
  try {
    // Test Pool
    const poolRes = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL (Pool) conectado:', poolRes.rows[0].now);
    
    // Test Sequelize
    await sequelize.authenticate();
    console.log('✅ PostgreSQL (Sequelize) conectado');
    
    // Sincronizar modelo
    await Presupuesto.sync({ alter: false });
    console.log('✅ Modelo Presupuesto sincronizado');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
};

testConnections();

export const Presupuesto = presupuestoModel(sequelize);