"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Event extends sequelize_1.Model {
}
exports.Event = Event;
Event.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('image', 'xml'),
        allowNull: false,
    },
    content_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    content_text: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'events',
    timestamps: true,
});
