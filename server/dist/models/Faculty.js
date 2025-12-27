"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Faculty extends sequelize_1.Model {
    // Helper method to parse qualifications from JSON string
    getQualificationsArray() {
        try {
            return JSON.parse(this.qualifications || '[]');
        }
        catch {
            return [];
        }
    }
    // Helper method to set qualifications from array
    setQualificationsArray(qualifications) {
        this.qualifications = JSON.stringify(qualifications);
    }
}
exports.Faculty = Faculty;
Faculty.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    specialization: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    office: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: '/default-avatar.svg',
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    qualifications: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: '[]',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Faculty',
    tableName: 'faculties',
});
exports.default = Faculty;
