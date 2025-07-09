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

        const rating = Rating.fromPayload(value);
        await rating.save();

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
