"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const StudentDue_1 = require("../models/StudentDue");
const Due_1 = require("../models/Due");
const Payment_1 = require("../models/Payment");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require student authentication
router.use(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('student'));
// Get student dues
router.get('/dues', async (req, res) => {
    try {
        const studentDues = await StudentDue_1.StudentDue.findAll({
            where: { student_id: req.user.id },
            include: [{ model: Due_1.Due, as: 'due' }],
        });
        const formattedDues = studentDues.map((sd) => ({
            id: sd.id,
            due_title: sd.due?.title || 'Unknown',
            total_amount: sd.due?.amount || 0,
            amount_paid: sd.amount_paid,
            balance: sd.balance,
            status: sd.status,
        }));
        res.json(formattedDues);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Initiate payment
router.post('/payment/initiate', async (req, res) => {
    try {
        const { due_id, amount } = req.body;
        const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        res.json({ reference });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Verify payment
router.post('/payment/verify', async (req, res) => {
    try {
        const { reference } = req.body;
        // In production, verify with Paystack API
        // For now, we'll simulate a successful payment
        // Extract due_id and amount from reference or request
        const studentDue = await StudentDue_1.StudentDue.findOne({
            where: { student_id: req.user.id },
        });
        if (!studentDue) {
            return res.status(404).json({ message: 'Due not found' });
        }
        const amount = 100; // This should come from Paystack verification
        // Create payment record
        await Payment_1.Payment.create({
            student_id: req.user.id,
            due_id: studentDue.due_id,
            amount,
            payment_reference: reference,
            payment_method: 'Paystack',
        });
        // Update student due
        const newAmountPaid = parseFloat(studentDue.amount_paid.toString()) + amount;
        const newBalance = parseFloat(studentDue.balance.toString()) - amount;
        await studentDue.update({
            amount_paid: newAmountPaid,
            balance: newBalance,
            status: newBalance <= 0 ? 'Paid' : 'Partial',
        });
        res.json({ message: 'Payment verified successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get payment history
router.get('/payments', async (req, res) => {
    try {
        const user = await User_1.User.findByPk(req.user.id);
        const payments = await Payment_1.Payment.findAll({
            where: { student_id: req.user.id },
            include: [{ model: Due_1.Due, as: 'due' }],
        });
        const formattedPayments = payments.map((p) => ({
            id: p.id,
            due_title: p.due?.title || 'Unknown',
            amount: p.amount,
            payment_reference: p.payment_reference,
            date: p.date,
            student_name: user?.name,
            index_number: user?.index_number,
            level: user?.level,
        }));
        res.json(formattedPayments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Change password
router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }
        const user = await User_1.User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if current password is correct
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        // Hash the new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
