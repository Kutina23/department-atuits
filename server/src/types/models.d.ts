import { Model, ModelStatic, Optional } from 'sequelize';

// User Model
declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: Express.Multer.File;
    }
  }
}

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'hod' | 'student';
  indexNumber?: string;
  level?: string;
  phone?: string;
  status: string;
  programId?: number;
  studentId?: string;
  contactNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  // Instance methods can be added here
}

// Due Model
export interface DueAttributes {
  id: number;
  name: string;
  amount: number;
  description?: string;
  dueDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DueCreationAttributes extends Optional<DueAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface DueInstance extends Model<DueAttributes, DueCreationAttributes>, DueAttributes {
  // Instance methods
  destroy: () => Promise<void>;
}

// StudentDue Model
export interface StudentDueAttributes {
  id: number;
  userId: number;
  dueId: number;
  amount: number;
  isPaid: boolean;
  paymentDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudentDueCreationAttributes extends Optional<StudentDueAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface StudentDueInstance extends Model<StudentDueAttributes, StudentDueAttributes>, StudentDueAttributes {
  // Instance methods
  destroy: () => Promise<void>;
  save: () => Promise<void>;
}

// Payment Model
export interface PaymentAttributes {
  id: number;
  userId: number;
  amount: number;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  studentDueId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface PaymentInstance extends Model<PaymentAttributes, PaymentCreationAttributes>, PaymentAttributes {
  // Instance methods
  destroy: () => Promise<void>;
  save: () => Promise<void>;
}

// Event Model
export interface EventAttributes {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface EventInstance extends Model<EventAttributes, EventCreationAttributes>, EventAttributes {
  // Instance methods
  destroy: () => Promise<void>;
  save: () => Promise<void>;
}

// Faculty Model
export interface FacultyAttributes {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FacultyCreationAttributes extends Optional<FacultyAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface FacultyInstance extends Model<FacultyAttributes, FacultyCreationAttributes>, FacultyAttributes {
  // Instance methods
  destroy: () => Promise<void>;
  save: () => Promise<void>;
}

// Program Model
export interface ProgramAttributes {
  id: number;
  name: string;
  description: string;
  facultyId: number;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProgramCreationAttributes extends Optional<ProgramAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ProgramInstance extends Model<ProgramAttributes, ProgramCreationAttributes>, ProgramAttributes {
  // Instance methods
  destroy: () => Promise<void>;
  save: () => Promise<void>;
}

// Partner Model
export interface PartnerAttributes {
  id: number;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  type: 'academic' | 'industry' | 'community';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PartnerCreationAttributes extends Optional<PartnerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface PartnerInstance extends Model<PartnerAttributes, PartnerCreationAttributes>, PartnerAttributes {
  // Instance methods
  destroy: () => Promise<void>;
  save: () => Promise<void>;
}

// Add model instances to global namespace
declare global {
  namespace NodeJS {
    interface Global {
      User: ModelStatic<UserInstance>;
      Due: ModelStatic<DueInstance>;
      StudentDue: ModelStatic<StudentDueInstance>;
      Payment: ModelStatic<PaymentInstance>;
      Event: ModelStatic<EventInstance>;
      Faculty: ModelStatic<FacultyInstance>;
      Program: ModelStatic<ProgramInstance>;
      Partner: ModelStatic<PartnerInstance>;
    }
  }
}
