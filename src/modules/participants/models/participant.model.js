import db from '../../../config/firebase/firebase.js';

class Participant {
    constructor({
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

        return new Participant({
            user_id: obj?.user_id,
            participant_user_id: obj?.participant_user_id,
            user_name: obj?.user_name,
            email: obj?.email,
            join_time: obj?.join_time,
            is_host: obj?.isHost,
            host_id: obj?.host_id,
            meeting_id: obj?.meeting_id,
            meeting_uuid: obj?.meeting_uuid,
        });
    }

    static async getById(id) {
        const doc = await Participant.collection().doc(id).get();
        if (!doc.exists) return null;
        return new Participant({ id: doc.id, ...doc.data() });
    }

    async save() {
        const dataToSave = { ...this };
        delete dataToSave.id;

        if (this.id) {
            await Participant.collection().doc(this.id).set(dataToSave);
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
