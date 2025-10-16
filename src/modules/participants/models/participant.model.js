import db from '../../../config/firebase/firebase.js';

class Participant {
    constructor({
        id, // Añadir id para poder instanciar con el id del documento
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

    static fromZoomPayload(payload) {
        const obj = payload?.object;
        const participant = obj?.participant;

        return new Participant({
            user_id: participant?.user_id,
            participant_user_id: participant?.participant_user_id,
            user_name: participant?.user_name,
            email: participant?.email,
            join_time: participant?.join_time,
            is_host: participant?.participant_user_id === obj?.host_id,
            host_id: obj?.host_id,
            meeting_id: obj?.id,
            meeting_uuid: obj?.uuid,
        });
    }

    static async findOrCreate(payload) {
        const obj = payload?.object;
        const participant = obj?.participant;
        const meeting_id = obj?.id;
        const participant_user_id = participant?.participant_user_id;

        // Solo buscamos si el participant_user_id existe (es un usuario logueado de Zoom, no un invitado)
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

        // Si no se encontró o es un invitado (sin participant_user_id), se crea uno nuevo.
        console.log('✨ Participante no encontrado o es un invitado, creando uno nuevo.');
        const newParticipant = Participant.fromZoomPayload(payload);
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
        delete dataToSave.id; // No guardar el id del documento dentro del documento

        // Limpiar campos nulos o indefinidos antes de guardar
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