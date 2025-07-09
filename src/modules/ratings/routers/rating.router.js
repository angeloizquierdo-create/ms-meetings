import { Router } from 'express';
import { 
    saveRating 
} from "../controllers/rating.controller.js";

const RatingRouter = Router();
RatingRouter.post('/save', saveRating);

export default RatingRouter;