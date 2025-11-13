
import { supabase } from '../../../config/supabase/supabase.js';

class Participant {
    constructor(id, participant_id, meeting_id, user_id, user_name, join_time, is_host) {
        this.id = id;
        this.participant_id = participant_id;
        this.meeting_id = meeting_id;
        this.user_id = user_id;
        this.user_name = user_name;
        this.join_time = join_time;
        this.is_host = is_host;
    }

    static fromZoomPayload(data) {
        return new Participant(
            null, // id is null for new participants
            data.id,
            data.meeting_id,
            data.user_id,
            data.user_name,
            data.join_time,
            data.is_host
        );
    }

    static async findOrCreate(participantData) {
        const { data: existing, error: checkError } = await supabase
            .from('participants')
            .select('*')
            .eq('participant_id', participantData.id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
            throw new Error(checkError.message);
        }

        if (existing) {
            return { participant: existing, created: false };
        }

        const newParticipant = Participant.fromZoomPayload(participantData);
        const { data, error } = await supabase.from('participants').insert([newParticipant]);
        if (error) throw new Error(error.message);
        return { participant: data[0], created: true };
    }

    static async getAllParticipants() {
        const { data, error } = await supabase.from('participants').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllParticipantsByMeetingId(meeting_id) {
        const { data, error } = await supabase.from('participants').select('*').eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getAllHosts() {
        const { data, error } = await supabase.from('participants').select('*').eq('is_host', true);
        if (error) throw new Error(error.message);
        return data;
    }

    static async getHostByHostId(host_id) {
        const { data, error } = await supabase.from('participants').select('*').eq('user_id', host_id).eq('is_host', true).single();
        if (error) throw new Error(error.message);
        return data;
    }

    static async deleteById(participant_id) {
        const { data, error } = await supabase.from('participants').delete().eq('participant_id', participant_id);
        if (error) throw new Error(error.message);
        return data;
    }

    static async deleteByMeetingId(meeting_id) {
        const { data, error } = await supabase.from('participants').delete().eq('meeting_id', meeting_id);
        if (error) throw new Error(error.message);
        return data;
    }
}

export default Participant;
