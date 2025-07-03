import { Router } from 'express';
import { 
    saveMeeting,
    getAllMeetings 
} from '../controllers/meeting.controller.js';

const MeetingRouter = Router();

MeetingRouter.post('/save', saveMeeting);
MeetingRouter.get('/all', getAllMeetings);

export default MeetingRouter;
