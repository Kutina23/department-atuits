"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
require("./models/index");
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const student_1 = __importDefault(require("./routes/student"));
const hod_1 = __importDefault(require("./routes/hod"));
const events_1 = __importDefault(require("./routes/events"));
const public_1 = __importDefault(require("./routes/public"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Serve static files from public directory
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
// Also serve public files at root level for backward compatibility
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes - Mount public routes first to avoid conflicts with admin routes
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/student', student_1.default);
app.use('/api/hod', hod_1.default);
app.use('/api/events', events_1.default);
// Mount public routes before admin routes to avoid conflicts
app.use('/api', public_1.default);
// Database connection and server start
const startServer = async () => {
    try {
        await database_1.sequelize.authenticate();
        console.log('Database connected successfully');
        // Sync database models (without force to avoid conflicts with init-db)
        await database_1.sequelize.sync();
        console.log('Database models synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};
startServer();
