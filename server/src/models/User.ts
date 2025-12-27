import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../types/models';

// Define the User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'student' | 'hod';
  public indexNumber?: string;
  public level?: string;
  public phone?: string;
  public status: string = 'active';
  public programId?: number;
  public studentId?: string;
  public contactNumber?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method for model initialization
  public static initialize(sequelize: Sequelize): ModelStatic<User> {
    return User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('admin', 'student', 'hod'),
          allowNull: false,
          defaultValue: 'student',
        },
        indexNumber: {
          type: DataTypes.STRING,
          field: 'index_number',
          allowNull: true,
        },
        level: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        studentId: {
          type: DataTypes.STRING,
          field: 'student_id',
          allowNull: true,
        },
        programId: {
          type: DataTypes.INTEGER,
          field: 'program_id',
          allowNull: true,
          references: {
            model: 'programs',
            key: 'id',
          },
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'active',
        },
        contactNumber: {
          type: DataTypes.STRING,
          field: 'contact_number',
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,
      }
    );
  }

  // Define associations
  public static associate(models: any): void {
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