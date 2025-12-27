import 'express';
import { User } from '../../models/User';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      file?: Express.Multer.File;
      [key: string]: any;
    }
    
    export interface Response {
      [key: string]: any;
    }
  }
}

export interface AuthRequest extends Express.Request {
  user?: User;
  body: any;
  params: any;
  query: any;
  file?: Express.Multer.File;
}
