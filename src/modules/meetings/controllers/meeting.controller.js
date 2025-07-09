import Meeting from '../models/meeting.model.js';
import { parseDate } from '../../shared/utils/parseDate.js';

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

export const updateMeetingStatusById = async (req, res) => {
    try {
        const { meeting_id } = req.params;
        const { status } = req.body;

        if (!meeting_id || !status) {
            return res.status(400).json({
                status: 'error',
                message: 'meeting_id y status son requeridos',
            });
        }

        const updated = await Meeting.updateStatusByMeetingId(Number(meeting_id), status);

        if (!updated) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Estado de reunión actualizado correctamente',
            data: updated,
        });
    } catch (error) {
        console.error('🔥 Error al actualizar status de reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al actualizar status',
            error: error.message,
        });
    }
};

export const updateMeetingSummaryById = async (req, res) => {
    try {
        const { meeting_id } = req.params;
        const { summary } = req.body;

        console.log('Updating summary for meeting_id:', meeting_id, 'with summary:', summary);

        if (!meeting_id || typeof summary !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'meeting_id y summary son requeridos',
            });
        }

        const updated = await Meeting.updateSummaryByMeetingId(Number(meeting_id), summary);

        if (!updated) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Resumen actualizado correctamente',
            data: updated,
        });
    } catch (error) {
        console.error('🔥 Error al actualizar summary de reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al actualizar summary',
            error: error.message,
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

export const getMeetingsGroupedByStatus = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const rawMeetings = await Meeting.getLastMeetings(limit);

        const now = new Date();
        const grouped = {
            pending: [],
            started: [],
            finished: [],
            not_open: [],
        };

        for (const meeting of rawMeetings) {
            const startTime = parseDate(meeting.start_time);

            if (meeting.status === 'pending') {
                if (startTime > now) {
                    grouped.pending.push(meeting);
                } else {
                    grouped.not_open.push(meeting);
                }
            } else if (meeting.status === 'started') {
                grouped.started.push(meeting);
            } else if (meeting.status === 'finished') {
                grouped.finished.push(meeting);
            }
        }

        return res.status(200).json({
            status: 'ok',
            message: `Últimas ${limit} reuniones agrupadas correctamente`,
            data: grouped,
        });
    } catch (error) {
        console.error('🔥 Error al agrupar reuniones:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al agrupar reuniones',
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

export const getGroupedDelays = async (_req, res) => {
    try {
        const data = await Meeting.getGroupedDelaysByHostId();

        return res.status(200).json({
            status: 'ok',
            message: 'Tardanzas agrupadas por host obtenidas correctamente',
            data,
        });
    } catch (error) {
        console.error('🔥 Error al agrupar tardanzas por host:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener la información de tardanza',
            error: error.message,
        });
    }
};

export const getTopDelayedHosts = async (req, res) => {
    try {
        const topDelayedHosts = await Meeting.getTopDelayedHosts();

        return res.status(200).json({
            status: 'ok',
            message: 'Top de hosts con más tardanzas obtenido correctamente',
            data: topDelayedHosts,
        });
    } catch (error) {
        console.error('🔥 Error al obtener top de hosts con tardanza:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener el top de tardanzas',
            error: error.message,
        });
    }
};


