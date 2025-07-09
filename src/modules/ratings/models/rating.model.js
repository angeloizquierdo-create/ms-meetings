import db from "../../../config/firebase/firebase.js";

class Rating {
    constructor({
        meeting_id,
        host_id,
        score = null,
    }) {
        this.meeting_id = meeting_id;
        this.host_id = host_id;
        this.score = score || null;
    }

    static collection() {
        return db.collection('ratings');
    }

    static fromPayload(payload) {
        return new Rating({
            meeting_id: payload?.meeting_id,
            host_id: payload?.host_id,
            score: payload?.score || null,
        });
    }

    async save() {
        const dataToSave = { ...this };
        delete dataToSave.id;

        if (this.id) {
            await Rating.collection().doc(this.id).set(dataToSave);
        } else {
            const docRef = await Rating.collection().add(dataToSave);
            this.id = docRef.id;
        }

        return this;
    }

}

export default Rating;