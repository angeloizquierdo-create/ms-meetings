
import { supabase } from '../../../config/supabase/supabase.js';

/**
 * The Meeting class is a data model that represents meetings and provides static methods
 * for interacting with the 'reuniones' table in the Supabase database.
 * It encapsulates all direct database operations related to meetings.
 */
class Meeting {

    /**
     * Inserts a new meeting record into the database.
     * @param {object} meetingData - The meeting object to create. Should not contain an 'id' property.
     * @returns {Promise<object>} The newly created meeting object from the database.
     */
    static async create(meetingData) {
        const { data, error } = await supabase
            .from('reuniones')
            .insert([meetingData])
            .select()
            .single(); // Return the inserted object

        if (error) {
            console.error("Error creating meeting in model:", error);
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Finds a single meeting by its unique meeting_id and occurrence_id.
     * @param {string|number} meeting_id - The main identifier for the meeting.
     * @param {string} [occurrence_id] - The identifier for a specific occurrence of a recurring meeting.
     * @returns {Promise<object|null>} The found meeting object, or null if not found.
     */
    static async findByMeetingAndOccurrenceId(meeting_id, occurrence_id) {
        let query = supabase
            .from('reuniones')
            .select('*')
            .eq('meeting_id', meeting_id);

        // Only add the occurrence_id condition if it is not null or undefined
        if (occurrence_id) {
            query = query.eq('occurrence_id', occurrence_id);
        }

        const { data, error } = await query.single();

        // Specific error 'PGRST116' means no rows were found, which is a valid case (return null).
        if (error && error.code !== 'PGRST116') {
            throw new Error(error.message);
        }

        return data;
    }

    static async deleteByMeetingId(meeting_id) {
        const { data, error } = await supabase.from('reuniones').delete().eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateStatusByMeetingId(meeting_id, status) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ status })
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateMeetingByMeetingId(meeting_id, dataToUpdate) {
        const { data, error } = await supabase
            .from('reuniones')
            .update(dataToUpdate)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateMeetingByOccurrenceId(occurrence_id, meeting_id, dataToUpdate) {
        const { data, error } = await supabase
            .from('reuniones')
            .update(dataToUpdate)
            .eq('occurrence_id', occurrence_id)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateStatusByOccurrenceId(occurrence_id, meeting_id, status) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ status })
            .eq('occurrence_id', occurrence_id)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateSummaryByMeetingId(meeting_id, summary) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ summary })
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateSummaryByOccurrenceId(occurrence_id, meeting_id, summary) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ summary })
            .eq('occurrence_id', occurrence_id)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAll() {
        const { data, error } = await supabase.from('reuniones').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllByStatus(status) {
        const { data, error } = await supabase.from('reuniones').select('*').eq('status', status);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getLastMeetings(limit) {
        const { data, error } = await supabase.from('reuniones').select('*').limit(limit);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getTodayMeetings() {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .gte('start_time', `${today}T00:00:00.000Z`)
            .lte('start_time', `${today}T23:59:59.999Z`);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase.from('reuniones').select('*').eq('id', id).single();
        if (error) throw new Error(error.message);
        return data;
    }

    static async getByMeetingId(meeting_id, occurrence_id) {
        let query = supabase.from('reuniones').select('*').eq('meeting_id', meeting_id);
        if (occurrence_id) {
            query = query.eq('occurrence_id', occurrence_id);
        }
        const { data, error } = await query.single();
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllByMeetingId(meeting_id) {
        const { data, error } = await supabase.from('reuniones').select('*').eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getGroupedDelaysByHostId() {
        const { data, error } = await supabase.rpc('get_grouped_delays_by_host_id');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getTopDelayedHosts(limit) {
        const { data, error } = await supabase.rpc('get_top_delayed_hosts', { limit_count: limit });
        if (error) throw new Error(error.message);
        return data;
    }

    static async getHostsMoreInfo() {
        const { data, error } = await supabase.rpc('get_hosts_more_info');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllByHostId(host_id) {
        const { data, error } = await supabase.from('reuniones').select('*').eq('host_id', host_id);
        if (error) throw new Error(error.message);
        return data;
    }
}

export default Meeting;
