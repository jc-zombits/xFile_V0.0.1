import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Solución para importar JSON - Opción recomendada
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../../config/config.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configData[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Cargar modelos dinámicamente
const modelFiles = fs.readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ));

// Usamos Promise.all para cargar modelos en paralelo
await Promise.all(modelFiles.map(async (file) => {
  const modelPath = path.join(__dirname, file);
  const { default: model } = await import(modelPath);
  db[model.name] = model;
}));

// Configurar asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;