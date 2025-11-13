
import Rating from '../models/rating.model.js';
import { CreateRatingValidator } from '../validators/rating.validator.js';

export const saveRating = async (req, res) => {
    try {
        const { error, value } = CreateRatingValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Error de validación',
                details: error.details.map(d => d.message),
            });
        }

        const rating = await Rating.fromPayload(value).save();

        return res.status(201).json({
            status: 'ok',
            message: 'Rating guardado exitosamente',
            data: rating,
        });
    } catch (err) {
        console.error('🔥 Error al guardar el rating:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al guardar el rating',
            error: err.message,
        });
    }
};

export const getRatingsByHostId = async (req, res) => {
    try {
        const { host_id } = req.params;

        if (!host_id) {
            return res.status(400).json({
                status: 'error',
                message: 'host_id no proporcionado',
            });
        }

        const ratings = await Rating.getAllByHostId(host_id);

        if (!ratings.length) {
            return res.status(200).json({
                status: 'ok',
                message: 'No hay ratings para este host',
                data: [],
            });
        }

        const total = ratings.reduce((acc, r) => acc + (r.score || 0), 0);
        const average = parseFloat((total / ratings.length).toFixed(2));

        const result = {
            host_id,
            score_avg: average,
            total_ratings: ratings.length,
        };

        return res.status(200).json({
            status: 'ok',
            message: 'Promedio de ratings obtenido correctamente',
            data: result,
        });
    } catch (error) {
        console.error('🔥 Error al obtener ratings por host_id:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener los ratings',
            error: error.message,
        });
    }
};

export const getGlobalAverageScore = async (_req, res) => {
    try {
        const average = await Rating.getGlobalAverageScore();

        return res.status(200).json({
            status: 'ok',
            message: 'Promedio global de ratings obtenido correctamente',
            data: {
                score_avg: average,
            },
        });
    } catch (error) {
        console.error('🔥 Error al obtener el promedio global:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener el promedio global',
            error: error.message,
        });
    }
};

export const getAllRatingsGrouped = async (_req, res) => {
    try {
        const groupedRatings = await Rating.getGroupedRatingsByHostId();

        return res.status(200).json({
            status: 'ok',
            message: 'Promedio de ratings obtenido correctamente',
            data: groupedRatings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener promedios agrupados:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener los promedios de ratings',
            error: error.message,
        });
    }
};

export const getTopRatedHosts = async (_req, res) => {
    try {
        const topHosts = await Rating.getTopRatedHosts(5);

        return res.status(200).json({
            status: 'ok',
            message: 'Top docentes mejor calificados obtenidos correctamente',
            data: topHosts,
        });
    } catch (error) {
        console.error('🔥 Error al obtener top docentes:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener top docentes',
            error: error.message,
        });
    }
};

export const getRatedHosts = async (_req, res) => {
    try {
        const topHosts = await Rating.getTopRatedHosts();

        return res.status(200).json({
            status: 'ok',
            message: 'Top docentes mejor calificados obtenidos correctamente',
            data: topHosts,
        });
    } catch (error) {
        console.error('🔥 Error al obtener top docentes:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener top docentes',
            error: error.message,
        });
    }
};

export const getAverageScoreByMeetingId = async (req, res) => {
    try {
        const { meeting_id } = req.params;

        if (!meeting_id) {
            return res.status(400).json({
                status: 'error',
                message: 'meeting_id no proporcionado',
            });
        }

        const average = await Rating.getAverageByMeetingId(meeting_id);

        if (average === null) {
            return res.status(200).json({
                status: 'ok',
                message: `No hay ratings para la reunión ${meeting_id}`,
                data: {
                    meeting_id,
                    average: null
                }
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: `Promedio de ratings de la reunión ${meeting_id} obtenido correctamente`,
            data: {
                meeting_id,
                average
            }
        });
    } catch (error) {
        console.error('🔥 Error al obtener promedio de ratings por meeting_id:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener el promedio de ratings',
            error: error.message,
        });
    }
};
