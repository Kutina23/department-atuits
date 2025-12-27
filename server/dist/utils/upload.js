"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
// Custom storage engine for Supabase
const supabaseStorage = {
    _handleFile: async (req, file, cb) => {
        try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExt = path_1.default.extname(file.originalname);
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
            req.uploadedFile = {
                path: filePath,
                url: publicUrl,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            };
            cb(null, { path: publicUrl });
        }
        catch (error) {
            cb(error);
        }
    },
    _removeFile: async (req, file, cb) => {
        try {
            // Get file path from the stored file info
            const filePath = req.uploadedFile?.path;
            if (filePath) {
                await supabase.storage
                    .from('department-uploads')
                    .remove([filePath]);
            }
            cb(null);
        }
        catch (error) {
            cb(error);
        }
    }
};
// Create multer instance
exports.upload = (0, multer_1.default)({
    storage: supabaseStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
exports.default = exports.upload;
