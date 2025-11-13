
import { supabase } from '../../../config/supabase/supabase.js';

class Meeting {
    constructor(id, meeting_id, occurrence_id, host_id, topic, start_time, status, created_at, summary) {
        this.id = id;
        this.meeting_id = meeting_id;
        this.occurrence_id = occurrence_id;
        this.host_id = host_id;
        this.topic = topic;
        this.start_time = start_time;
        this.status = status;
        this.created_at = created_at;
        this.summary = summary;
    }

    static fromZoomPayload(payload) {
        const { object } = payload;
        const occurrenceId = payload.object.occurrences?.[0]?.occurrence_id;

        return new Meeting(
            null, // id is null for new meetings
            object.id,
            occurrenceId,
            object.host_id,
            object.topic,
            object.start_time,
            'pending', // initial status
            new Date().toISOString(),
            null // summary is null initially
        );
    }

    async save() {
        const { data, error } = await supabase.from('meetings').insert([this]);
        if (error) throw new Error(error.message);
        return data;
    }

    static async checkAndCreateMeeting(payload) {
        const { object } = payload;
        const meeting_id = object.id;
        const occurrence_id = payload.object.occurrences?.[0]?.occurrence_id;

        const { data: existing, error: checkError } = await supabase
            .from('meetings')
            .select('id')
            .eq('meeting_id', meeting_id)
            .eq('occurrence_id', occurrence_id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
            throw new Error(checkError.message);
        }

        if (existing) {
            console.log(`Meeting with meeting_id ${meeting_id} and occurrence_id ${occurrence_id} already exists.`);
            return null; // Indicates that the meeting already exists
        }

        const meeting = Meeting.fromZoomPayload(payload);
        const { data, error } = await supabase.from('meetings').insert([meeting]);
        if (error) throw new Error(error.message);
        return data;
    }

    static async deleteByMeetingId(meeting_id) {
        const { data, error } = await supabase.from('meetings').delete().eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateStatusByMeetingId(meeting_id, status) {
        const { data, error } = await supabase
            .from('meetings')
            .update({ status })
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateMeetingByMeetingId(meeting_id, dataToUpdate) {
        const { data, error } = await supabase
            .from('meetings')
            .update(dataToUpdate)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateMeetingByOccurrenceId(occurrence_id, meeting_id, dataToUpdate) {
        const { data, error } = await supabase
            .from('meetings')
            .update(dataToUpdate)
            .eq('occurrence_id', occurrence_id)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateStatusByOccurrenceId(occurrence_id, meeting_id, status) {
        const { data, error } = await supabase
            .from('meetings')
            .update({ status })
            .eq('occurrence_id', occurrence_id)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateSummaryByMeetingId(meeting_id, summary) {
        const { data, error } = await supabase
            .from('meetings')
            .update({ summary })
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async updateSummaryByOccurrenceId(occurrence_id, meeting_id, summary) {
        const { data, error } = await supabase
            .from('meetings')
            .update({ summary })
            .eq('occurrence_id', occurrence_id)
            .eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAll() {
        const { data, error } = await supabase.from('meetings').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllByStatus(status) {
        const { data, error } = await supabase.from('meetings').select('*').eq('status', status);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getLastMeetings(limit) {
        const { data, error } = await supabase.from('meetings').select('*').limit(limit);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getTodayMeetings() {
        const today = new Date().toISOString().slice(0, 10);
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .gte('start_time', `${today}T00:00:00.000Z`)
            .lte('start_time', `${today}T23:59:59.999Z`);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getById(id) {
        const { data, error } = await supabase.from('meetings').select('*').eq('id', id).single();
        if (error) throw new Error(error.message);
        return data;
    }

    static async getByMeetingId(meeting_id, occurrence_id) {
        let query = supabase.from('meetings').select('*').eq('meeting_id', meeting_id);
        if (occurrence_id) {
            query = query.eq('occurrence_id', occurrence_id);
        }
        const { data, error } = await query.single();
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllByMeetingId(meeting_id) {
        const { data, error } = await supabase.from('meetings').select('*').eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async findByMeetingAndOccurrenceId(meeting_id, occurrence_id) {
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .eq('meeting_id', meeting_id)
            .eq('occurrence_id', occurrence_id)
            .single();
        if (error && error.code !== 'PGRST116') throw new Error(error.message);
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
        const { data, error } = await supabase.from('meetings').select('*').eq('host_id', host_id);
        if (error) throw new Error(error.message);
        return data;
    }
}

export default Meeting;
