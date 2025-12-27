"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const Due_1 = require("./Due");
const StudentDue_1 = require("./StudentDue");
const Payment_1 = require("./Payment");
const Event_1 = require("./Event");
const Program_1 = require("./Program");
const Faculty_1 = require("./Faculty");
const Partner_1 = require("./Partner");
// Initialize Sequelize
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'department_db', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    },
});
// Export models
const db = {
    User: User_1.User,
    Due: Due_1.Due,
    StudentDue: StudentDue_1.StudentDue,
    Payment: Payment_1.Payment,
    Event: Event_1.Event,
    Program: Program_1.Program,
    Faculty: Faculty_1.Faculty,
    Partner: Partner_1.Partner,
    sequelize,
    Sequelize: sequelize_1.Sequelize,
};
// Set up associations
Object.values(db).forEach(model => {
    if ('associate' in model) {
        model.associate(db);
    }
});
exports.default = db;
