import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: process.env.PG_USER,
    password: String(process.env.PG_PASSWORD), // Conversión explícita a string
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false // Si usas SSL, cámbialo a true
    }
  }
};