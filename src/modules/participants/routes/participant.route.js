import { Router } from 'express';
import {
    saveParticipant,
    getAllHosts,
    getAllParticipants,
    getHostByHostId,
    getParticipantsByMeetingId,
    deleteParticipantById
} from '../controllers/participant.controller.js';

const ParticipantRouter = Router();

ParticipantRouter.post('/save', saveParticipant);
ParticipantRouter.get('/all-participants', getAllParticipants);
ParticipantRouter.get('/all-participants-by-meeting/:meeting_id', getParticipantsByMeetingId);
ParticipantRouter.get('/all-hosts', getAllHosts);
ParticipantRouter.get('/by-host-id/:host_id', getHostByHostId);
ParticipantRouter.delete('/delete/:participant_id', deleteParticipantById);

export default ParticipantRouter;
