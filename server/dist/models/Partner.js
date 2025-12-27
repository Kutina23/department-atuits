"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partner = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Partner extends sequelize_1.Model {
}
exports.Partner = Partner;
Partner.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Company/Organization name',
    },
    logo_url: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        comment: 'URL to partner logo image',
    },
    website_url: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        comment: 'Partner website URL',
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'Brief description of the partnership',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether partner should be displayed',
    },
    sort_order: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Display order for partners',
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'partners',
    timestamps: true,
    indexes: [
        {
            fields: ['isActive', 'sort_order'],
        },
    ],
});
