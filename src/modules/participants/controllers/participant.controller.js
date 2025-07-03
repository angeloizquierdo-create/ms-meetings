import Participant from '../models/participant.model.js';

export const saveParticipant = async (req, res) => {
    try {
        const payload = req.body?.payload;

        if (!payload || !payload.object) {
            return res.status(400).json({ error: 'Payload inválido' });
        }

        const participant = Participant.fromZoomPayload(payload);
        await participant.save();

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
