import express from 'express';
import { getrecommendedUsers, getMyFriends } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendFriendRequest } from '../controllers/user.controller.js';
import { acceptFriendRequest } from '../controllers/user.controller.js';
import { getFriendRequests } from '../controllers/user.controller.js';
import { getOutgoingFriendReqs } from '../controllers/user.controller.js';


const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);


router.get("/",getrecommendedUsers);
router.get('/friends',getMyFriends);

router.post('/friend-request/:id',sendFriendRequest);
router.put('/friend-request/:id/accept',acceptFriendRequest);

router.get('/friend-requests',getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);



export default router;