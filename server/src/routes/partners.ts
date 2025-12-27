import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Partner } from '../models/Partner.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

// Define custom request interface
interface PartnerRequest extends Request {
  user?: any;
  params: {
    [key: string]: string;
  };
  body: {
    name?: string;
    logo_url?: string;
    website_url?: string;
    description?: string;
    isActive?: boolean;
    sort_order?: number;
    [key: string]: any;
  };
}

const router = Router();

// Apply authentication to all admin routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// GET /api/partners - Get all partners for admin (including inactive)
router.get('/', async (req: PartnerRequest, res: Response) => {
  try {
    const partners = await (Partner as any).findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching partners'
    });
  }
});

// POST /api/partners - Create new partner
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').optional().trim(),
    body('website').optional().trim().isURL().withMessage('Invalid website URL'),
    body('logo').optional().trim(),
    body('is_active').optional().isBoolean().toBoolean(),
    body('sort_order').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req: PartnerRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { name, logo_url, website_url, description, isActive = true, sort_order = 0 } = req.body;

      const partner = await (Partner as any).create({
        name: name || '',
        logo_url: logo_url || '',
        website_url: website_url || '',
        description: description || '',
        isActive: isActive !== undefined ? isActive : true,
        sort_order: sort_order || 0
      });

      res.status(201).json({
        success: true,
        data: partner,
        message: 'Partner created successfully'
      });
    } catch (error) {
      console.error('Error creating partner:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating partner'
      });
    }
  }
);

// PUT /api/partners/:id - Update partner
router.put('/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('logo_url').optional().trim().notEmpty().withMessage('Logo URL cannot be empty'),
    body('website_url').optional().isURL().withMessage('Website URL must be a valid URL'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer')
  ],
  async (req: PartnerRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const partner = await (Partner as any).findByPk(id);

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
    } catch (error) {
      console.error('Error updating partner:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating partner'
      });
    }
  }
);

// DELETE /api/partners/:id - Delete partner
router.delete('/:id', async (req: PartnerRequest, res: Response) => {
  try {
    const { id } = req.params;
    const partner = await (Partner as any).findByPk(id);

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
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting partner'
    });
  }
});

// GET /api/partners/count - Get partner count for stats
router.get('/count', async (req: PartnerRequest, res: Response) => {
  try {
    const count = await (Partner as any).count({
      where: { isActive: true }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error counting partners:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting partners'
    });
  }
});

export default router;