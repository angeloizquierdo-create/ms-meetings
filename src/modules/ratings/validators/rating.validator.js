import Joi from 'joi';

export const CreateRatingValidator = Joi.object({
    meeting_id: Joi.string().required().messages({
        'string.base': 'El meeting_id debe ser un texto',
        'any.required': 'El meeting_id es obligatorio',
    }),
    host_id: Joi.string().required().messages({
        'string.base': 'El host_id debe ser un texto',
        'any.required': 'El host_id es obligatorio',
    }),
    score: Joi.number().min(1).max(5).required().messages({
        'number.base': 'El score debe ser un número',
        'number.min': 'El score mínimo es 1',
        'number.max': 'El score máximo es 5',
        'any.required': 'El score es obligatorio',
    }),
});
