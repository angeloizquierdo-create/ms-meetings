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
        // SOLUCIÓN DE ESCRITURA: Asegurar que el meeting_id en el objeto sea siempre numérico
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
            const numericId = Number(meeting_id);
            const stringId = String(meeting_id);

            let query;
            // Prioridad 1: Buscar por user_id (cuenta de Zoom) y meeting_id
            if (user_id) {
                query = Participant.collection()
                    .where('user_id', '==', user_id)
                    .where('meeting_id', 'in', [numericId, stringId]);
            } 
            // Prioridad 2: Buscar por email (invitado) y meeting_id
            else if (email) {
                query = Participant.collection()
                    .where('email', '==', email)
                    .where('meeting_id', 'in', [numericId, stringId]);
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
        // Al crear, nos aseguramos de que el meeting_id se guarde como número a través del constructor.
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
        // Asegurarse de que el meeting_id es un número antes de guardar
        if (dataToSave.meeting_id) {
            dataToSave.meeting_id = Number(dataToSave.meeting_id);
        }
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
        const snapshot = await Participant.collection()
            .where('is_host', '==', true)
            .where('host_id', '==', hostId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return new Participant({ id: doc.id, ...doc.data() });
    }
    
    // Las demás funciones no necesitan cambios si no buscan por meeting_id
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