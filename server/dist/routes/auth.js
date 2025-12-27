"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                indexNumber: user.index_number,
                level: user.level,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get current user
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            indexNumber: user.index_number,
            level: user.level,
            phone: user.phone,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
