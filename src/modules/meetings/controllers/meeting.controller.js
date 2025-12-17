
import Meeting from '../models/meeting.model.js';

// --- NUEVO ---
// 1. Guarda una reunión
export const saveMeeting = async (req, res) => {
    try {
        // --- NUEVO ---
        // Se ha añadido el campo "occurrence_id" al cuerpo de la petición.
        const { meeting_id, occurrence_id, platform, ...body } = req.body;
        const meeting = await Meeting.getOneByMeetingId(meeting_id);

        if (meeting) {
            const updatedMeeting = await Meeting.updateByMeetingId(meeting_id, body);
            return res.status(200).json({
                status: 'ok',
                message: 'Reunión actualizada exitosamente',
                data: updatedMeeting,
            });
        } else {
            const newMeeting = await Meeting.save(meeting_id, occurrence_id, platform, body);
            return res.status(201).json({
                status: 'ok',
                message: 'Reunión creada exitosamente',
                data: newMeeting,
            });
        }
    } catch (error) {
        console.error('🔥 Error al guardar la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al guardar la reunión',
            error: error.message,
        });
    }
};


// 2. Obtiene todas las reuniones
export const getAllMeetings = async (_, res) => {
    try {
        const meetings = await Meeting.getAll();

        return res.status(200).json({
            status: 'ok',
            message: `Se encontraron ${meetings.length} reuniones`,
            data: meetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener todas las reuniones:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener las reuniones',
            error: error.message,
        });
    }
};

// 3. Obtiene una reunión por su ID
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

// --- NUEVO ---
// 4. Obtiene una reunión por el ID de la reunión
export const getMeetingByMeetingId = async (req, res) => {
    try {
        const { meeting_id } = req.params;

        if (!meeting_id) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID de la reunión no fue proporcionado',
            });
        }

        const meeting = await Meeting.getOneByMeetingId(meeting_id);

        if (!meeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Reunión encontrada exitosamente',
            data: meeting,
        });
    } catch (error) {
        console.error('🔥 Error al obtener la reunión por el ID de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener la reunión',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 5. Obtiene todas las reuniones que coinciden con el ID de la reunión
export const getAllMeetingsByMeetingId = async (req, res) => {
    try {
        const { meeting_id } = req.params;

        if (!meeting_id) {
            return res.status(400).json({
                status: 'error',
                message: 'El ID de la reunión no fue proporcionado',
            });
        }

        const meetings = await Meeting.getAllByMeetingId(meeting_id);

        if (!meetings || meetings.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encontraron reuniones para el ID proporcionado',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: `Se encontraron ${meetings.length} reuniones`,
            data: meetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener reuniones por el ID de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener las reuniones',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 6. Elimina una reunión por el ID de la reunión
export const deleteMeetingByMeetingId = async (req, res) => {
    try {
        const { meeting_id } = req.params;
        const result = await Meeting.deleteByMeetingId(meeting_id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encontraron reuniones para eliminar',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: `Se eliminaron ${result.deletedCount} reuniones`,
        });
    } catch (error) {
        console.error('🔥 Error al eliminar la reunión por el ID de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al eliminar la reunión',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 7. Actualiza el estado de una reunión por su ID
export const updateMeetingStatusById = async (req, res) => {
    try {
        const { meeting_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: 'error',
                message: 'El nuevo estado no fue proporcionado',
            });
        }

        const updatedMeeting = await Meeting.updateStatusById(meeting_id, status);

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: `Estado de la reunión actualizado a "${status}"`,
            data: updatedMeeting,
        });
    } catch (error) {
        console.error('🔥 Error al actualizar el estado de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar el estado de la reunión',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 8. Obtiene todas las reuniones por estado
export const getMeetingsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        if (!status) {
            return res.status(400).json({
                status: 'error',
                message: 'El status no fue proporcionado en la URL',
            });
        }

        const meetings = await Meeting.getAllByStatus(status);

        return res.status(200).json({
            status: 'ok',
            message: `Se encontraron ${meetings.length} reuniones con el status: ${status}`,
            data: meetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener reuniones por status:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al obtener las reuniones por status',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 9. Actualiza el resumen de una reunión por su ID
export const updateMeetingSummaryById = async (req, res) => {
    try {
        const { meeting_id } = req.params;
        const { summary, conclusion } = req.body;

        if (!summary || !conclusion) {
            return res.status(400).json({
                status: 'error',
                message: 'El resumen y la conclusión son obligatorios',
            });
        }

        const updatedMeeting = await Meeting.updateSummaryById(meeting_id, summary, conclusion);

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Resumen de la reunión actualizado exitosamente',
            data: updatedMeeting,
        });
    } catch (error) {
        console.error('🔥 Error al actualizar el resumen de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar el resumen de la reunión',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 10. Obtiene reuniones con filtros dinámicos
export const getMeetingsByFilters = async (req, res) => {
    try {
        const filters = req.query;
        const meetings = await Meeting.getByFilters(filters);

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

// --- NUEVO ---
// 11. Obtiene el recuento de tardanzas agrupadas por día
export const getGroupedDelays = async (_, res) => {
    try {
        const groupedDelays = await Meeting.getGroupedDelays();

        return res.status(200).json({
            status: 'ok',
            message: 'Recuento de tardanzas agrupadas por día obtenido correctamente',
            data: groupedDelays,
        });
    } catch (error) {
        console.error('🔥 Error al obtener tardanzas agrupadas:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener las tardanzas',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 12. Obtiene el top de hosts con más tardanzas
export const getTopDelayedHosts = async (_, res) => {
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

// --- NUEVO ---
// 13. Obtiene el recuento de reuniones agrupadas por estado
export const getMeetingsGroupedByStatus = async (_, res) => {
    try {
        const groupedMeetings = await Meeting.getMeetingsGroupedByStatus();
        return res.status(200).json({
            status: 'ok',
            data: groupedMeetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener reuniones agrupadas por estado:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener reuniones agrupadas',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 14. Obtiene el recuento de reuniones de hoy agrupadas por estado
export const getTodayMeetingsGroupedByStatus = async (_, res) => {
    try {
        const groupedMeetings = await Meeting.getTodayMeetingsGroupedByStatus();
        return res.status(200).json({
            status: 'ok',
            data: groupedMeetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener reuniones de hoy agrupadas por estado:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener reuniones de hoy agrupadas',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 15. Obtiene información adicional de los hosts
export const getHostsMoreInfo = async (_, res) => {
    try {
        const data = await Meeting.getHostsMoreInfo();

        return res.status(200).json({
            status: 'ok',
            data,
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

// --- NUEVO ---
// 16. Obtiene reuniones por ID de host
export const getMeetingsByHostId = async (req, res) => {
    try {
        const { host_id } = req.params;
        const meetings = await Meeting.getMeetingsByHostId(host_id);

        return res.status(200).json({
            status: 'ok',
            data: meetings,
        });
    } catch (error) {
        console.error('🔥 Error al obtener reuniones por host_id:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno al obtener reuniones por host_id',
            error: error.message,
        });
    }
}

// --- NUEVO ---
// 17. Actualiza una reunión por el ID de la reunión
export const updateMeetingByMeetingId = async (req, res) => {
    try {
        const { meeting_id } = req.params;
        const dataToUpdate = req.body;

        const updatedMeeting = await Meeting.updateByMeetingId(meeting_id, dataToUpdate);

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Reunión actualizada exitosamente',
            data: updatedMeeting,
        });

    } catch (error) {
        console.error('🔥 Error al actualizar la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar la reunión',
            error: error.message,
        });
    }
}

// --- NUEVO ---
// 18. Actualiza una reunión por el ID de la ocurrencia
export const updateMeetingByOccurrenceId = async (req, res) => {
    try {
        const { occurrence_id } = req.params;
        const dataToUpdate = req.body;

        const updatedMeeting = await Meeting.updateByOccurrenceId(occurrence_id, dataToUpdate);

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada con el occurrence_id proporcionado',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Reunión actualizada exitosamente',
            data: updatedMeeting,
        });

    } catch (error) {
        console.error('🔥 Error al actualizar la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar la reunión',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 19. Actualiza el estado de una reunión por el ID de la ocurrencia
export const updateMeetingStatusByOccurrenceId = async (req, res) => {
    try {
        const { occurrence_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: 'error',
                message: 'El nuevo estado no fue proporcionado',
            });
        }

        const updatedMeeting = await Meeting.updateStatusByOccurrenceId(occurrence_id, status);

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada con el occurrence_id proporcionado',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: `Estado de la reunión actualizado a "${status}"`,
            data: updatedMeeting,
        });
    } catch (error) {
        console.error('🔥 Error al actualizar el estado de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar el estado de la reunión',
            error: error.message,
        });
    }
};

// --- NUEVO ---
// 20. Actualiza el resumen de una reunión por el ID de la ocurrencia
export const updateMeetingSummaryByOccurrenceId = async (req, res) => {
    try {
        const { occurrence_id } = req.params;
        const { summary, conclusion } = req.body;

        if (!summary || !conclusion) {
            return res.status(400).json({
                status: 'error',
                message: 'El resumen y la conclusión son obligatorios',
            });
        }

        const updatedMeeting = await Meeting.updateSummaryByOccurrenceId(occurrence_id, summary, conclusion);

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 'error',
                message: 'Reunión no encontrada con el occurrence_id proporcionado',
            });
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Resumen de la reunión actualizado exitosamente',
            data: updatedMeeting,
        });
    } catch (error) {
        console.error('🔥 Error al actualizar el resumen de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al actualizar el resumen de la reunión',
            error: error.message,
        });
    }
};


// --- NUEVO ---
// 21. Verifica si una reunión existe
export const checkMeetingExists = async (req, res) => {
    try {
        const { meeting_id, occurrence_id } = req.params;

        if (!meeting_id || !occurrence_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Tanto meeting_id como occurrence_id son obligatorios',
            });
        }

        const meeting = await Meeting.findOneBy({ meeting_id, occurrence_id });

        if (meeting) {
            return res.status(200).json({
                status: 'ok',
                exists: true,
                data: meeting,
            });
        } else {
            return res.status(200).json({
                status: 'ok',
                exists: false,
            });
        }

    } catch (error) {
        console.error('🔥 Error al verificar la existencia de la reunión:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al verificar la existencia de la reunión',
            error: error.message,
        });
    }
};
