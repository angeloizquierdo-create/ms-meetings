
import { supabase } from "../../../config/supabase/supabase.js";

const Meeting = {
    async create(meetingData) {
        console.log("Attempting to create meeting in model with data:", meetingData);
        const { data, error } = await supabase
            .from('reuniones')
            .insert([meetingData])
            .select()
            .single();

        if (error) {
            console.error('Error creating meeting in model:', error);
            throw error;
        }
        return data;
    },

    async findByMeetingAndOccurrenceId(meetingId, occurrenceId) {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .eq('meeting_id', meetingId)
            .eq('occurrence_id', occurrenceId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            throw error;
        }
        return data;
    },

    async deleteByMeetingId(meetingId) {
        const { data, error } = await supabase
            .from('reuniones')
            .delete()
            .eq('meeting_id', meetingId)
            .select();

        if (error) {
            throw error;
        }
        return data;
    },

    async updateStatusByMeetingId(meetingId, status) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ status })
            .eq('meeting_id', meetingId)
            .select()
            .single();
        
        if (error) {
            throw error;
        }
        return data;
    },

    async updateMeetingByMeetingId(meetingId, dataToUpdate) {
        const { data, error } = await supabase
            .from('reuniones')
            .update(dataToUpdate)
            .eq('meeting_id', meetingId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    },

    async updateMeetingByOccurrenceId(occurrenceId, meetingId, dataToUpdate) {
        const { data, error } = await supabase
            .from('reuniones')
            .update(dataToUpdate)
            .eq('occurrence_id', occurrenceId)
            .eq('meeting_id', meetingId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    },

    async updateStatusByOccurrenceId(occurrenceId, meetingId, status) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ status })
            .eq('occurrence_id', occurrenceId)
            .eq('meeting_id', meetingId)
            .select()
            .single();
        
        if (error) {
            throw error;
        }
        return data;
    },

    async updateSummaryByMeetingId(meetingId, summary) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ summary })
            .eq('meeting_id', meetingId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    },

    async updateSummaryByOccurrenceId(occurrenceId, meetingId, summary) {
        const { data, error } = await supabase
            .from('reuniones')
            .update({ summary })
            .eq('occurrence_id', occurrenceId)
            .eq('meeting_id', meetingId)
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    },

    async getAll() {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*');
        
        if (error) {
            throw error;
        }
        return data;
    },

    async getAllByStatus(status) {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .eq('status', status);

        if (error) {
            throw error;
        }
        return data;
    },

    async getLastMeetings(limit) {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }
        return data;
    },

    async getTodayMeetings() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .gte('start_time', today.toISOString())
            .lt('start_time', tomorrow.toISOString())
            .order('start_time', { ascending: true });

        if (error) {
            throw error;
        }
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            throw error;
        }
        return data;
    },

    async getByMeetingId(meetingId, occurrenceId) {
        let query = supabase.from('reuniones').select('*').eq('meeting_id', meetingId);
        if (occurrenceId) {
            query = query.eq('occurrence_id', occurrenceId);
        }
        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        return data;
    },

    async getAllByMeetingId(meetingId) {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .eq('meeting_id', meetingId);

        if (error) {
            throw error;
        }
        return data;
    },

    async getGroupedDelaysByHostId() {
        const { data, error } = await supabase.rpc('get_grouped_host_delays');
        if (error) throw error;
        return data;
    },

    async getTopDelayedHosts(limit) {
        const { data, error } = await supabase.rpc('get_top_delayed_hosts', { limit_count: limit });
        if (error) throw error;
        return data;
    },

    async getHostsMoreInfo() {
        const { data, error } = await supabase.rpc('get_hosts_more_info');
        if (error) throw error;
        return data;
    },

    async getAllByHostId(hostId) {
        const { data, error } = await supabase
            .from('reuniones')
            .select('*')
            .eq('host_id', hostId);

        if (error) {
            throw error;
        }
        return data;
    }
}

export default Meeting;
