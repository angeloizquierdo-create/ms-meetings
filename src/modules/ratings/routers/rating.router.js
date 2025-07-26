import { Router } from 'express';
import { 
    saveRating,
    getRatingsByHostId,
    getAllRatingsGrouped,
    getTopRatedHosts,
    getGlobalAverageScore,
    getAverageScoreByMeetingId
} from "../controllers/rating.controller.js";

const RatingRouter = Router();
RatingRouter.post('/save', saveRating);
RatingRouter.get('/by-host-id/:host_id', getRatingsByHostId);
RatingRouter.get('/grouped', getAllRatingsGrouped);
RatingRouter.get('/top-rated', getTopRatedHosts);
RatingRouter.get('/global-average', getGlobalAverageScore);
RatingRouter.get('/average/:meeting_id', getAverageScoreByMeetingId);

export default RatingRouter;