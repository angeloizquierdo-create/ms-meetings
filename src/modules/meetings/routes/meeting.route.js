import { Router } from 'express';
import { 
    saveMeeting,
    getAllMeetings,
    getMeetingById,
    getMeetingByMeetingId
} from '../controllers/meeting.controller.js';

const MeetingRouter = Router();

MeetingRouter.post('/save', saveMeeting);
MeetingRouter.get('/all', getAllMeetings);
MeetingRouter.get('/:id', getMeetingById);
MeetingRouter.get('/by-meeting-id/:meeting_id', getMeetingByMeetingId);

export default MeetingRouter;
