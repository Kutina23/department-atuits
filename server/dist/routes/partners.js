"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Partner_1 = require("../models/Partner");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication to all admin routes
router.use(auth_1.authenticateToken);
router.use((0, auth_1.authorizeRoles)('admin'));
// GET /api/partners - Get all partners for admin (including inactive)
router.get('/', async (req, res) => {
    try {
        const partners = await Partner_1.Partner.findAll({
            order: [['sort_order', 'ASC'], ['name', 'ASC']]
        });
        res.json({
            success: true,
            data: partners
        });
    }
    catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching partners'
        });
    }
});
// POST /api/partners - Create new partner
router.post('/', [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('logo_url').trim().notEmpty().withMessage('Logo URL is required'),
    (0, express_validator_1.body)('website_url').optional().isURL().withMessage('Website URL must be a valid URL'),
    (0, express_validator_1.body)('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }
        const { name, logo_url, website_url, description, isActive = true, sort_order = 0 } = req.body;
        const partner = await Partner_1.Partner.create({
            name,
            logo_url,
            website_url,
            description,
            isActive,
            sort_order
        });
        res.status(201).json({
            success: true,
            data: partner,
            message: 'Partner created successfully'
        });
    }
    catch (error) {
        console.error('Error creating partner:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating partner'
        });
    }
});
// PUT /api/partners/:id - Update partner
router.put('/:id', [
    (0, express_validator_1.body)('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('logo_url').optional().trim().notEmpty().withMessage('Logo URL cannot be empty'),
    (0, express_validator_1.body)('website_url').optional().isURL().withMessage('Website URL must be a valid URL'),
    (0, express_validator_1.body)('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const partner = await Partner_1.Partner.findByPk(id);
        if (!partner) {
            return res.status(404).json({
                success: false,
                message: 'Partner not found'
            });
        }
        const { name, logo_url, website_url, description, isActive, sort_order } = req.body;
        await partner.update({
            ...(name !== undefined && { name }),
            ...(logo_url !== undefined && { logo_url }),
            ...(website_url !== undefined && { website_url }),
            ...(description !== undefined && { description }),
            ...(isActive !== undefined && { isActive }),
            ...(sort_order !== undefined && { sort_order })
        });
        res.json({
            success: true,
            data: partner,
            message: 'Partner updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating partner'
        });
    }
});
// DELETE /api/partners/:id - Delete partner
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner_1.Partner.findByPk(id);
        if (!partner) {
            return res.status(404).json({
                success: false,
                message: 'Partner not found'
            });
        }
        await partner.destroy();
        res.json({
            success: true,
            message: 'Partner deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting partner'
        });
    }
});
// GET /api/partners/count - Get partner count for stats
router.get('/count', async (req, res) => {
    try {
        const count = await Partner_1.Partner.count({
            where: { isActive: true }
        });
        res.json({
            success: true,
            data: { count }
        });
    }
    catch (error) {
        console.error('Error counting partners:', error);
        res.status(500).json({
            success: false,
            message: 'Error counting partners'
        });
    }
});
exports.default = router;
