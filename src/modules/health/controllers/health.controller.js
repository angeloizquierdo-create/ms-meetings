
import { supabase } from '../../../config/supabase/supabase.js';

/**
 * @name checkDatabaseConnection
 * @description Realiza una consulta simple a Supabase para verificar la conexión
 * y mantener el servicio activo.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
export const checkDatabaseConnection = async (req, res) => {
    try {
        console.log(`[Health Check] Se recibió un ping. Verificando la conexión con Supabase.`);

        // Realizamos una consulta simple para verificar la conexión.
        // Pedimos solo el 'id' de una fila para que sea una consulta ligera.
        const { error, data } = await supabase
            .from('reuniones')
            .select('id')
            .limit(1);

        if (error) {
            // Si hay un error en la consulta, la conexión ha fallado.
            throw error;
        }
        
        console.log(`[Health Check] ¡Éxito! La conexión con Supabase está activa.`);

        return res.status(200).json({
            status: 'ok',
            message: 'Servicio activo y base de datos conectada.',
        });

    } catch (error) {
        console.error('🔥 [Health Check] Error crítico al intentar conectar con Supabase:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error en el servidor al realizar el chequeo de salud.',
            error: error.message,
        });
    }
};
