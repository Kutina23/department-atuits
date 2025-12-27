"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDue = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class StudentDue extends sequelize_1.Model {
}
exports.StudentDue = StudentDue;
StudentDue.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    due_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    amount_paid: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('Not Paid', 'Partial', 'Paid'),
        defaultValue: 'Not Paid',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'student_dues',
    timestamps: true,
});
