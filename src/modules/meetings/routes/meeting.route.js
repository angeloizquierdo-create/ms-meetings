import { Router } from 'express';
import { 
    saveMeeting,
    deleteMeetingByMeetingId,
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
    getMeetingsByHostId,
    updateMeetingByMeetingId,
    updateMeetingByOccurrenceId,
    updateMeetingStatusByOccurrenceId,
    updateMeetingSummaryByOccurrenceId
} from '../controllers/meeting.controller.js';

const MeetingRouter = Router();

MeetingRouter.get('/get-hosts-more-info', getHostsMoreInfo)
MeetingRouter.get('/last', getMeetingsGroupedByStatus);
MeetingRouter.get('/grouped-today', getTodayMeetingsGroupedByStatus);
MeetingRouter.get('/grouped-delays', getGroupedDelays);
MeetingRouter.get('/top-delayed-hosts', getTopDelayedHosts);
MeetingRouter.post('/save', saveMeeting);
MeetingRouter.delete('/delete/by-meeting-id/:meeting_id', deleteMeetingByMeetingId);
MeetingRouter.get('/by-host/:host_id', getMeetingsByHostId);
MeetingRouter.patch('/summary/by-occurrence-id/:occurrence_id', updateMeetingSummaryByOccurrenceId);
MeetingRouter.patch('/summary/:meeting_id', updateMeetingSummaryById);
MeetingRouter.patch('/update/by-meeting-id/:meeting_id', updateMeetingByMeetingId);
MeetingRouter.patch('/update/by-occurrence-id/:occurrence_id', updateMeetingByOccurrenceId);
MeetingRouter.patch('/status/by-occurrence-id/:occurrence_id', updateMeetingStatusByOccurrenceId);
MeetingRouter.get('/all', getAllMeetings);
MeetingRouter.patch('/status/:meeting_id', updateMeetingStatusById);
MeetingRouter.get('/:id', getMeetingById);
MeetingRouter.get('/by-meeting-id/:meeting_id', getMeetingByMeetingId);

export default MeetingRouter;