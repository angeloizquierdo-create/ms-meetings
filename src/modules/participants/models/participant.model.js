import db from '../../../config/firebase/firebase.js';

class Participant {
    constructor({
        id,
        user_id,
        participant_user_id,
        user_name,
        email,
        join_time,
        is_host,
        host_id,
        meeting_id,
        meeting_uuid,
    }) {
        this.id = id;
        this.user_id = user_id;
        this.participant_user_id = participant_user_id || null;
        this.user_name = user_name || null;
        this.email = email || null;
        this.join_time = join_time;
        this.is_host = is_host;
        this.host_id = host_id;
        this.meeting_id = meeting_id;
        this.meeting_uuid = meeting_uuid;
    }

    static collection() {
        return db.collection('participantes');
    }
    
    static async findOrCreate(participantData) {
        const { meeting_id, user_id, email } = participantData;

        let existingParticipantQuery;

        // Opción 1 (la más fiable): Buscar por ID de usuario de Zoom (la cuenta).
        if (user_id) {
            existingParticipantQuery = Participant.collection()
                .where('meeting_id', '==', meeting_id)
                .where('user_id', '==', user_id);
        }
        // Opción 2 (para invitados sin cuenta): Buscar por email.
        else if (email) {
            existingParticipantQuery = Participant.collection()
                .where('meeting_id', '==', meeting_id)
                .where('email', '==', email);
        }

        // Si tenemos una consulta que ejecutar (es decir, el participante es identificable)
        if (existingParticipantQuery) {
            const snapshot = await existingParticipantQuery.limit(1).get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                console.log(`✅ Participante encontrado por user_id o email (ID: ${doc.id}), no se crea uno nuevo.`);
                return {
                    participant: new Participant({ id: doc.id, ...doc.data() }),
                    created: false,
                };
            }
        }

        // Si no se pudo identificar o si, tras buscar, no se encontró, se crea uno nuevo.
        console.log('✨ Participante no encontrado (o no identificable), creando uno nuevo.');
        const newParticipant = new Participant(participantData);
        await newParticipant.save();
        return {
            participant: newParticipant,
            created: true
        };
    }

    static async getById(id) {
        const doc = await Participant.collection().doc(id).get();
        if (!doc.exists) return null;
        return new Participant({ id: doc.id, ...doc.data() });
    }

    async save() {
        const dataToSave = { ...this };
        delete dataToSave.id;

        Object.keys(dataToSave).forEach(key => {
            if (dataToSave[key] === undefined) {
                delete dataToSave[key];
            }
        });

        if (this.id) {
            await Participant.collection().doc(this.id).set(dataToSave, { merge: true });
        } else {
            const docRef = await Participant.collection().add(dataToSave);
            this.id = docRef.id;
        }

        return this;
    }

    static async getAllHosts() {
        const snapshot = await Participant.collection()
            .where('is_host', '==', true)
            .get();

        const hosts = [];
        snapshot.forEach(doc => {
            hosts.push(new Participant({ id: doc.id, ...doc.data() }));
        });

        return hosts;
    }

    static async getAllParticipants() {
        const snapshot = await Participant.collection()
            .where('is_host', '==', false)
            .get();

        const participants = [];
        snapshot.forEach(doc => {
            participants.push(new Participant({ id: doc.id, ...doc.data() }));
        });

        return participants;
    }

    static async getAllParticipantsByMeetingId(meeting_id) {
        const snapshot = await Participant.collection()
            .where('is_host', '==', false)
            .where('meeting_id', '==', meeting_id)
            .get();

        const participants = [];
        snapshot.forEach(doc => {
            participants.push(new Participant({ id: doc.id, ...doc.data() }));
        });

        return participants;
    }

    static async getHostByHostId(hostId) {
        const snapshot = await Participant.collection()
            .where('is_host', '==', true)
            .where('host_id', '==', hostId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return new Participant({ id: doc.id, ...doc.data() });
    }
}

export default Participant;