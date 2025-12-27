"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Due = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Due extends sequelize_1.Model {
}
exports.Due = Due;
Due.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    level: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    academic_year: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'dues',
    timestamps: true,
});
