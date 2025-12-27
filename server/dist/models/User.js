"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
// Define the User model class
class User extends sequelize_1.Model {
    constructor() {
        super(...arguments);
        this.status = 'active';
    }
    // Static method for model initialization
    static initialize(sequelize) {
        return User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM('admin', 'student', 'hod'),
                allowNull: false,
                defaultValue: 'student',
            },
            indexNumber: {
                type: sequelize_1.DataTypes.STRING,
                field: 'index_number',
                allowNull: true,
            },
            level: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            studentId: {
                type: sequelize_1.DataTypes.STRING,
                field: 'student_id',
                allowNull: true,
            },
            programId: {
                type: sequelize_1.DataTypes.INTEGER,
                field: 'program_id',
                allowNull: true,
                references: {
                    model: 'programs',
                    key: 'id',
                },
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: 'active',
            },
            contactNumber: {
                type: sequelize_1.DataTypes.STRING,
                field: 'contact_number',
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'users',
            timestamps: true,
            underscored: true,
        });
    }
    // Define associations
    static associate(models) {
        User.hasMany(models.StudentDue, {
            foreignKey: 'userId',
            as: 'studentDues',
        });
        User.hasMany(models.Payment, {
            foreignKey: 'userId',
            as: 'payments',
        });
        User.belongsTo(models.Program, {
            foreignKey: 'programId',
            as: 'program',
        });
    }
}
exports.User = User;
