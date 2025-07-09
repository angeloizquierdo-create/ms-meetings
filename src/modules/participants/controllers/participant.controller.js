import Participant from '../models/participant.model.js';
import Meeting from '../../meetings/models/meeting.model.js';
import { parseDate } from '../utils/parseDate.js';

export const saveParticipant = async (req, res) => {
    try {
        const payload = req.body?.payload;

        if (!payload || !payload.object) {
            return res.status(400).json({ error: 'Payload inválido' });
        }

        const participant = Participant.fromZoomPayload(payload);
        await participant.save();

        if (participant.is_host) {
            const { meeting_id, join_time } = participant;

            const meeting = await Meeting.getByMeetingId(Number(meeting_id));
            if (!meeting) {
                console.warn(`⚠️ Reunión no encontrada para meeting_id: ${meeting_id}`);
            } else if(meeting.delay) {
                console.log('✅ Reunión ya marcada como con delay, no se actualiza nuevamente');
            } else {
                const joinTime = parseDate(join_time);
                const startTime = parseDate(meeting.start_time);

                const delayInMin = Math.floor((joinTime - startTime) / 60000);

                if (delayInMin > 5) {
                    await Meeting.updateDelayByMeetingId(Number(meeting_id), true, delayInMin);
                    console.log(`🚨 Host tardó ${delayInMin} min en ingresar. Marcado como delay.`);
                } else {
                    console.log('✅ Host ingresó a tiempo');
                }
            }
        }

        return res.status(201).json({
            status: 'ok',
            message: 'Participante guardado exitosamente',
            data: participant,
        });
    } catch (error) {
        console.error('🔥 Error al guardar participante:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al guardar el participante',
            error: error.message,
        });
    }
};

export const getAllParticipants = async (_req, res) => {
    try {
        const participants = await Participant.getAllParticipants();

        return res.status(200).json({
            status: 'ok',
            message: 'Participantes obtenidos exitosamente',
            data: participants,
        });
    } catch (error) {
        console.error('🔥 Error al obtener participantes:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener los participantes',
            error: error.message,
        });
    }
};

export const getAllHosts = async (_req, res) => {
    try {
        const hosts = await Participant.getAllHosts();

        return res.status(200).json({
            status: 'ok',
            message: 'Anfitriones obtenidos exitosamente',
            data: hosts,
        });
    } catch (error) {
        console.error('🔥 Error al obtener anfitriones:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener los anfitriones',
            error: error.message,
        });
    }
};

export const getHostByHostId = async (req, res) => {
    try {
        const { host_id } = req.params;

        if (!host_id) {
            return res.status(400).json({
                status: 'error',
                message: 'host_id no proporcionado',
            });
        }

        const host = await Participant.getHostByHostId(host_id);

        if (!host) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encontró un anfitrión con ese host_id',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Anfitrión obtenido exitosamente',
            data: host,
        });
    } catch (error) {
        console.error('🔥 Error al obtener anfitrión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener anfitrión',
            error: error.message,
        });
    }
};

