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
        // SOLUCIÓN DE ESCRITURA: Asegurar que los IDs sean siempre numéricos en el objeto
        this.user_id = user_id ? Number(user_id) : user_id;
        this.participant_user_id = participant_user_id || null;
        this.user_name = user_name || null;
        this.email = email || null;
        this.join_time = join_time;
        this.is_host = is_host;
        this.host_id = host_id ? Number(host_id) : host_id;
        this.meeting_id = meeting_id ? Number(meeting_id) : meeting_id;
        this.meeting_uuid = meeting_uuid;
    }

    static collection() {
        return db.collection('participantes');
    }

    static async findOrCreate(participantData) {
        const { meeting_id, user_id, email } = participantData;

        let existingParticipantDoc = null;

        if (meeting_id && (user_id || email)) {
            const numericMeetingId = Number(meeting_id);
            const stringMeetingId = String(meeting_id);

            let query;
            if (user_id) {
                const numericUserId = Number(user_id);
                const stringUserId = String(user_id);
                // SOLUCIÓN DE LECTURA: Buscar user_id Y meeting_id como número y texto
                query = Participant.collection()
                    .where('user_id', 'in', [numericUserId, stringUserId])
                    .where('meeting_id', 'in', [numericMeetingId, stringMeetingId]);
            } else if (email) {
                query = Participant.collection()
                    .where('email', '==', email)
                    .where('meeting_id', 'in', [numericMeetingId, stringMeetingId]);
            }

            if (query) {
                const snapshot = await query.limit(1).get();
                if (!snapshot.empty) {
                    existingParticipantDoc = snapshot.docs[0];
                }
            }
        }

        if (existingParticipantDoc) {
            console.log(`✅ Participante encontrado (ID: ${existingParticipantDoc.id}), no se crea uno nuevo.`);
            return {
                participant: new Participant({ id: existingParticipantDoc.id, ...existingParticipantDoc.data() }),
                created: false,
            };
        }

        console.log('✨ Participante no encontrado, creando uno nuevo.');
        const newParticipant = new Participant(participantData);
        await newParticipant.save();
        return {
            participant: newParticipant,
            created: true
        };
    }

    async save() {
        const dataToSave = { ...this };
        // SOLUCIÓN DE ESCRITURA: Forzar conversión a número antes de guardar
        if (dataToSave.meeting_id) dataToSave.meeting_id = Number(dataToSave.meeting_id);
        if (dataToSave.user_id) dataToSave.user_id = Number(dataToSave.user_id);
        if (dataToSave.host_id) dataToSave.host_id = Number(dataToSave.host_id);
        
        delete dataToSave.id;

        Object.keys(dataToSave).forEach(key => {
            if (dataToSave[key] === undefined) delete dataToSave[key];
        });

        if (this.id) {
            await Participant.collection().doc(this.id).set(dataToSave, { merge: true });
        } else {
            const docRef = await Participant.collection().add(dataToSave);
            this.id = docRef.id;
        }
        return this;
    }

    static async getAllByMeetingId(meeting_id) {
        const numericId = Number(meeting_id);
        const stringId = String(meeting_id);

        const snapshot = await Participant.collection()
            .where('meeting_id', 'in', [numericId, stringId])
            .get();

        const participants = [];
        snapshot.forEach(doc => {
            participants.push(new Participant({ id: doc.id, ...doc.data() }));
        });
        return participants;
    }

    static async getAllParticipantsByMeetingId(meeting_id) {
        const numericId = Number(meeting_id);
        const stringId = String(meeting_id);

        const snapshot = await Participant.collection()
            .where('is_host', '==', false)
            .where('meeting_id', 'in', [numericId, stringId])
            .get();

        const participants = [];
        snapshot.forEach(doc => {
            participants.push(new Participant({ id: doc.id, ...doc.data() }));
        });
        return participants;
    }

    static async getHostByHostId(hostId) {
        const numericHostId = Number(hostId);
        const stringHostId = String(hostId);

        // SOLUCIÓN DE LECTURA: Buscar host_id como número y texto
        const snapshot = await Participant.collection()
            .where('is_host', '==', true)
            .where('host_id', 'in', [numericHostId, stringHostId])
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return new Participant({ id: doc.id, ...doc.data() });
    }
    
    // Funciones que no cambian
    static async getById(id) {
        const doc = await Participant.collection().doc(id).get();
        if (!doc.exists) return null;
        return new Participant({ id: doc.id, ...doc.data() });
    }

    static async getAllHosts() {
        const snapshot = await Participant.collection().where('is_host', '==', true).get();
        const hosts = [];
        snapshot.forEach(doc => {
            hosts.push(new Participant({ id: doc.id, ...doc.data() }));
        });
        return hosts;
    }

    static async getAllParticipants() {
        const snapshot = await Participant.collection().where('is_host', '==', false).get();
        const participants = [];
        snapshot.forEach(doc => {
            participants.push(new Participant({ id: doc.id, ...doc.data() }));
        });
        return participants;
    }
}

export default Participant;