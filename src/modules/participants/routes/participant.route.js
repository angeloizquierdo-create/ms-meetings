import { Router } from 'express';
import {
    saveParticipant,
    getAllHosts,
    getAllParticipants
} from '../controllers/participant.controller.js';

const ParticipantRouter = Router();

ParticipantRouter.post('/save', saveParticipant);
ParticipantRouter.get('/all-participants', getAllParticipants);
ParticipantRouter.get('/all-hosts', getAllHosts);

export default ParticipantRouter;
