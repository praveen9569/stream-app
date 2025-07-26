import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

const router = express.Router();

router.get("/token",protectRoute, getStreamToken); // Route to get Stream token, protected by auth middleware


export default router;