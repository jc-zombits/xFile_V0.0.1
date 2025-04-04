// src/config/database.js
import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

const { Pool } = pkg;
dotenv.config();

// 1. Primero configura las conexiones
export const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT || 5432,
});

export const sequelize = new Sequelize({
  database: process.env.PG_DATABASE,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  dialect: 'postgres',
  logging: false,
});

// 2. Exporta sequelize sin modelos inicializados
export const initModels = async () => {
  const { presupuestoModel } = await import('../domains/controllers/presupuesto.model.js');
  return {
    Presupuesto: presupuestoModel(sequelize)
  };
};

// 3. Test de conexión básico
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL (Sequelize) conectado');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
})();