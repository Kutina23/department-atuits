"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Event_1 = require("../models/Event");
const router = express_1.default.Router();
// Get all events (public)
router.get('/', async (req, res) => {
    try {
        const events = await Event_1.Event.findAll({ order: [['createdAt', 'DESC']] });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
