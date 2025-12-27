"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Parse Supabase database URL if available
const getDbConfig = () => {
    if (process.env.SUPABASE_DB_URL) {
        // Extract connection details from Supabase URL
        const url = new URL(process.env.SUPABASE_DB_URL);
        return {
            database: url.pathname.replace('/', ''),
            username: url.username,
            password: url.password,
            host: url.hostname,
            port: parseInt(url.port, 10),
            dialect: 'postgres', // Ensure proper typing for dialect
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false,
        };
    }
    // Fallback to local PostgreSQL configuration
    return {
        database: process.env.DB_NAME || 'department_db',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres', // Ensure proper typing for dialect
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
    };
};
const dbConfig = getDbConfig();
exports.sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: dbConfig.logging
});
// Test the database connection
exports.sequelize.authenticate()
    .then(() => {
    console.log('Database connection has been established successfully.');
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
