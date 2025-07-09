import { Router } from 'express';
import { 
    saveRating,
    getRatingsByHostId,
    getAllRatingsGrouped,
    getTopRatedHosts
} from "../controllers/rating.controller.js";

const RatingRouter = Router();
RatingRouter.post('/save', saveRating);
RatingRouter.get('/by-host-id/:host_id', getRatingsByHostId);
RatingRouter.get('/grouped', getAllRatingsGrouped);
RatingRouter.get('/top-rated', getTopRatedHosts);

export default RatingRouter;