import db from "../../../config/firebase/firebase";

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
}

export default Rating;