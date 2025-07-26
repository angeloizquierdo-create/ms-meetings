import db from "../../../config/firebase/firebase.js";
import Participant from "../../participants/models/participant.model.js";

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

    static async getAllByHostId(hostId) {
        const snapshot = await Rating.collection()
            .where('host_id', '==', hostId)
            .get();

        const ratings = [];
        snapshot.forEach(doc => {
            ratings.push(new Rating({ id: doc.id, ...doc.data() }));
        });

        return ratings;
    }

    static async getGlobalAverageScore() {
        const snapshot = await Rating.collection().get();

        let totalScore = 0;
        let count = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (typeof data.score === 'number') {
                totalScore += data.score;
                count += 1;
            }
        });

        if (count === 0) return null;

        const average = totalScore / count;
        return parseFloat(average.toFixed(2));
    }

    static async getGroupedRatingsByHostId() {
        const snapshot = await Rating.collection().get();
        const ratingsMap = new Map();

        snapshot.forEach(doc => {
            const data = doc.data();
            const { host_id, score } = data;

            if (!ratingsMap.has(host_id)) {
                ratingsMap.set(host_id, {
                    host_id,
                    total: 0,
                    count: 0,
                });
            }

            const current = ratingsMap.get(host_id);
            current.total += score || 0;
            current.count += 1;
        });

        const grouped = await Promise.all(
            Array.from(ratingsMap.values()).map(async ({ host_id, total, count }) => {
                let user_name = null;
                let email = null;

                const host = await Participant.getHostByHostId(host_id);
                if (host) {
                    user_name = host.user_name || null;
                    email = host.email || null;
                }

                return {
                    host_id,
                    user_name,
                    email,
                    score_avg: parseFloat((total / count).toFixed(2)),
                    total_ratings: count,
                };
            })
        );

        return grouped;
    }

    static async getTopRatedHosts(limit) {
        const allGrouped = await Rating.getGroupedRatingsByHostId();

        const sorted = allGrouped.sort((a, b) => b.score_avg - a.score_avg);

        return limit ? sorted.slice(0, limit) : sorted;
    }

    static async getAverageByMeetingId(meetingId) {
        const snapshot = await Rating.collection()
            .where('meeting_id', '==', meetingId)
            .get();

        if (snapshot.empty) return null;

        let totalScore = 0;
        let count = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (typeof data.score === 'number') {
                totalScore += data.score;
                count += 1;
            }
        });

        if (count === 0) return null;

        const average = totalScore / count;
        return parseFloat(average.toFixed(2));
    }
}

export default Rating;