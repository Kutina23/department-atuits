"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Program extends sequelize_1.Model {
}
exports.Program = Program;
Program.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    focus: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    highlights: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('highlights');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('highlights', JSON.stringify(value));
        },
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'programs',
    timestamps: true,
});
