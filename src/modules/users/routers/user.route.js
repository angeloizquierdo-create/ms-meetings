import { Router } from 'express';
import { 
    getUserByEmail 
} from '../controllers/user.controller.js';

const UserRouter = Router();
UserRouter.get('/by-email/:email', getUserByEmail);

export default UserRouter;