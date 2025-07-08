import Meeting from '../models/meeting.model.js';

export const saveMeeting = async (req, res) => {
    try {
        const payload = req.body?.payload;

        if (!payload || !payload.object) return res.status(400).json({ error: 'Payload inválido' });

        const meeting = Meeting.fromZoomPayload(payload);
        await meeting.save();

        return res.status(201).json({
            status: 'ok',
            message: 'Reunión guardada exitosamente',
            data: meeting
        });
    } catch (error) {
        console.error('🔥 Error al guardar la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al guardar la reunión',
            error: error.message
        });
    }
};

export const getAllMeetings = async (_req, res) => {
    try {
        const meetings = await Meeting.getAll();

        return res.status(200).json({
            status: 'ok',
            message: 'Reuniones obtenidas exitosamente',
            data: meetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener reuniones:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener las reuniones',
            error: error.message,
        });
    }
};

export const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de la reunión no proporcionado',
            });
        }

        const meeting = await Meeting.getById(id);

        if (!meeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Reunión obtenida exitosamente',
            data: meeting,
        });
    } catch (error) {
        console.error('🔥 Error al obtener la reunión por ID:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener la reunión',
            error: error.message,
        });
    }
};

export const getMeetingByMeetingId = async (req, res) => {
    try {
        const { meeting_id } = req.params;

        if (!meeting_id) {
            return res.status(400).json({
                status: 'error',
                message: 'meeting_id no proporcionado',
            });
        }

        const meeting = await Meeting.getByMeetingId(Number(meeting_id));

        if (!meeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada con ese meeting_id',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Reunión obtenida exitosamente por meeting_id',
            data: meeting,
        });
    } catch (error) {
        console.error('🔥 Error al obtener la reunión por meeting_id:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener la reunión',
            error: error.message,
        });
    }
};

