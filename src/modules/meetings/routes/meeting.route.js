import { Router } from 'express';
import { 
    saveMeeting,
    getAllMeetings,
    getMeetingById,
    getMeetingByMeetingId,
    getGroupedDelays,
    getTopDelayedHosts,
    updateMeetingStatusById,
    updateMeetingSummaryById,
    getMeetingsGroupedByStatus,
    getTodayMeetingsGroupedByStatus,
    getHostsMoreInfo,
    getMeetingsByHostId
} from '../controllers/meeting.controller.js';

const MeetingRouter = Router();

MeetingRouter.get('/get-hosts-more-info', getHostsMoreInfo)
MeetingRouter.get('/last', getMeetingsGroupedByStatus);
MeetingRouter.get('/grouped-today', getTodayMeetingsGroupedByStatus);
MeetingRouter.get('/grouped-delays', getGroupedDelays);
MeetingRouter.get('/top-delayed-hosts', getTopDelayedHosts);
MeetingRouter.post('/save', saveMeeting);
MeetingRouter.get('/by-host/:host_id', getMeetingsByHostId);
MeetingRouter.patch('/summary/:meeting_id', updateMeetingSummaryById);
MeetingRouter.get('/all', getAllMeetings);
MeetingRouter.patch('/status/:meeting_id', updateMeetingStatusById);
MeetingRouter.get('/:id', getMeetingById);
MeetingRouter.get('/by-meeting-id/:meeting_id', getMeetingByMeetingId);

export default MeetingRouter;
