import { Sequelize } from 'sequelize';
import 'dotenv/config';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_NAME = 'basecoat_portal',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  NODE_ENV = 'development',
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
