
import { supabase } from '../../../config/supabase/supabase.js';

class Rating {
    constructor(id, meeting_id, host_id, score, comment, created_at) {
        this.id = id;
        this.meeting_id = meeting_id;
        this.host_id = host_id;
        this.score = score;
        this.comment = comment;
        this.created_at = created_at;
    }

    static fromPayload(payload) {
        return new Rating(
            null, // id is null for new ratings
            payload.meeting_id,
            payload.host_id,
            payload.score,
            payload.comment,
            new Date().toISOString()
        );
    }

    async save() {
        const { id, ...insertData } = this;
        const { data, error } = await supabase.from('ratings').insert([insertData]).select().single();
        if (error) throw new Error(error.message);
        Object.assign(this, data);
        return this;
    }

    static async getAllByHostId(host_id) {
        const { data, error } = await supabase.from('ratings').select('*').eq('host_id', host_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getGlobalAverageScore() {
        const { data, error } = await supabase.rpc('get_global_average_score');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getGroupedRatingsByHostId() {
        const { data, error } = await supabase.rpc('get_grouped_ratings_by_host');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getTopRatedHosts(limit = 5) {
        const { data, error } = await supabase.rpc('get_top_rated_hosts', { limit_count: limit });
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAverageByMeetingId(meeting_id) {
        const { data, error } = await supabase
            .from('ratings')
            .select('score')
            .eq('meeting_id', meeting_id);

        if (error) throw new Error(error.message);
        if (!data || data.length === 0) return null;

        const total = data.reduce((acc, r) => acc + r.score, 0);
        const average = total / data.length;
        return parseFloat(average.toFixed(2));
    }
}

export default Rating;
