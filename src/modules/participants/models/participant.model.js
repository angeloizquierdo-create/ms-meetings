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
        const { meeting_id, participant_user_id } = participantData;

        // Si el participante tiene un ID de Zoom, buscamos si ya existe en esa reunión.
        if (participant_user_id) {
            const snapshot = await Participant.collection()
                .where('meeting_id', '==', meeting_id)
                .where('participant_user_id', '==', participant_user_id)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                console.log(`✅ Participante encontrado (ID: ${doc.id}), no se crea uno nuevo.`);
                return {
                    participant: new Participant({ id: doc.id, ...doc.data() }),
                    created: false,
                };
            }
        }

        // Si no se encontró (o es un invitado sin participant_user_id), se crea uno nuevo.
        console.log('✨ Participante no encontrado o es un invitado, creando uno nuevo.');
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
