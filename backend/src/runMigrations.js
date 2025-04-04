import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../sequelize.config.js';

// Configura paths para ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sequelize = new Sequelize(config.development);

const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.js', { cwd: __dirname }],
    resolve: ({ name, path: migrationPath }) => {
      const migration = import(migrationPath);
      return {
        name,
        up: async () => (await migration).up(sequelize.getQueryInterface(), Sequelize),
        down: async () => (await migration).down(sequelize.getQueryInterface(), Sequelize)
      };
    }
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});

(async () => {
  try {
    await umzug.up();
    console.log('✅ Migraciones completadas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    process.exit(1);
  }
})();