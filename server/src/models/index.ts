import { Sequelize } from 'sequelize';
import { User } from './User';
import { Due } from './Due';
import { StudentDue } from './StudentDue';
import { Payment } from './Payment';
import { Event } from './Event';
import { Program } from './Program';
import { Faculty } from './Faculty';
import { Partner } from './Partner';

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'department_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);

// Export models
const db = {
  User,
  Due,
  StudentDue,
  Payment,
  Event,
  Program,
  Faculty,
  Partner,
  sequelize,
  Sequelize,
};

// Set up associations
Object.values(db).forEach(model => {
  if ('associate' in model) {
    model.associate(db);
  }
});

export default db;