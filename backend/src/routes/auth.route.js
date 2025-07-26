import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';
import { onboard } from '../controllers/auth.controller.js'; 
const router = express.Router();


router.post('/signup', signup);     

router.post('/login', login  );  

router.post('/logout', logout);

router.post('/onboarding',protectRoute,onboard)
// check if user is logged in or not
router.get('/me', protectRoute, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});


export default router;



