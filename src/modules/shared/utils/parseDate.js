export function parseDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;

    const parts = dateStr.split(', ');
    if (parts.length !== 2) return null;

    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');

    if (!day || !month || !year || !hour || !minute) return null;

    return new Date(`${year}-${month}-${day}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`);
}
