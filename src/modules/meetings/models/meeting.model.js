import db from '../../../config/firebase/firebase.js';

class Meeting {
    constructor({
        meeting_id,
        uuid,
        topic,
        startTime,
        status,
        duration,
        host_id,
        host_email,
        score = null,
    }) {
        this.meeting_id = meeting_id;
        this.uuid = uuid;
        this.topic = topic;
        this.start_time = startTime;
        this.status = status;
        this.duration = duration;
        this.host_id = host_id;
        this.host_email = host_email;
        this.score = score || null;
    }

    static collection() {
        return db.collection('reuniones');
    }

    static fromZoomPayload(payload) {
        const obj = payload?.object;

        return new Meeting({
            meeting_id: obj?.id,
            uuid: obj?.uuid,
            topic: obj?.topic,
            startTime: obj?.start_time,
            status: obj?.status,
            duration: obj?.duration,
            host_id: obj?.host_id,
            host_email: obj?.host_email,
        });
    }

    static async getById(id) {
        const doc = await Meeting.collection().doc(id).get();
        if (!doc.exists) return null;
        return new Meeting({ id: doc.id, ...doc.data() });
    }

    async save() {
        const dataToSave = { ...this };
        delete dataToSave.id;

        if (this.id) {
            await Meeting.collection().doc(this.id).set(dataToSave);
        } else {
            const docRef = await Meeting.collection().add(dataToSave);
            this.id = docRef.id;
        }

        return this;
    }

    static async getAll() {
        const snapshot = await Meeting.collection().get();
        const meetings = [];

        snapshot.forEach(doc => {
            meetings.push(new Meeting({ id: doc.id, ...doc.data() }));
        });

        return meetings;
    }
}

export default Meeting;
