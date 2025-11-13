
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
        let formattedJoinTime = data.join_time;

        // The error log shows a date format like "13/11/2025, 15:03".
        // PostgreSQL expects a standard format like "YYYY-MM-DD HH:mm:ss".
        // We will convert the custom format to an ISO 8601 string that the database understands.
        if (formattedJoinTime && typeof formattedJoinTime === 'string' && formattedJoinTime.includes('/')) {
            const parts = formattedJoinTime.split(', ');
            if (parts.length === 2) {
                const dateParts = parts[0].split('/');
                if (dateParts.length === 3) {
                    const [day, month, year] = dateParts;
                    // Reformat to 'YYYY-MM-DDTHH:mm:ss' which is a valid ISO 8601 format.
                    formattedJoinTime = `${year}-${month}-${day}T${parts[1]}:00`;
                }
            }
        }

        return new Participant(
            null, // id is null for new participants
            data.id,
            data.meeting_id,
            data.user_id,
            data.user_name,
            formattedJoinTime, // Use the correctly formatted timestamp
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

        const { id, ...insertData } = newParticipant;

        const { data, error } = await supabase.from('participants').insert([insertData]).select();

        if (error) {
            console.error("Error inserting participant:", error);
            throw new Error(error.message);
        }

        return { participant: data[0], created: true };
    }
    
    // ... (resto de los métodos sin cambios)

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
