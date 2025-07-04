import { Router } from 'express';
import { 
    saveMeeting,
    getAllMeetings,
    getMeetingById 
} from '../controllers/meeting.controller.js';

const MeetingRouter = Router();

MeetingRouter.post('/save', saveMeeting);
MeetingRouter.get('/all', getAllMeetings);
MeetingRouter.get('/:id', getMeetingById);

export default MeetingRouter;
