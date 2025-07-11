import User from '../models/user.model.js';

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email no proporcionado',
            });
        }

        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Usuario obtenido exitosamente',
            data: user,
        });
    } catch (error) {
        console.error('🔥 Error al obtener usuario por email:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al buscar el usuario',
            error: error.message,
        });
    }
};
