import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Custom storage engine for Supabase
const supabaseStorage = {
  _handleFile: async (req: Request, file: Express.Multer.File, cb: (error?: any, info?: { path: string }) => void) => {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = path.extname(file.originalname);
      const fileName = `faculty-${uniqueSuffix}${fileExt}`;
      const filePath = `faculty/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('department-uploads')
        .upload(filePath, file.stream, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('department-uploads')
        .getPublicUrl(filePath);

      // Attach file info to request for later use in routes
      (req as any).uploadedFile = {
        path: filePath,
        url: publicUrl,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      };

      cb(null, { path: publicUrl });
    } catch (error) {
      cb(error as Error);
    }
  },
  _removeFile: async (req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) => {
    try {
      // Get file path from the stored file info
      const filePath = (req as any).uploadedFile?.path;
      if (filePath) {
        await supabase.storage
          .from('department-uploads')
          .remove([filePath]);
      }
      cb(null);
    } catch (error) {
      cb(error as Error);
    }
  }
};

// Create multer instance
export const upload = multer({
  storage: supabaseStorage as any,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export default upload;