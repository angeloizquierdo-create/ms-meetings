import db from '../../../config/firebase/firebase.js';
import Participant from '../../participants/models/participant.model.js';
import Rating from '../../ratings/models/rating.model.js';
import { parseDate } from '../../shared/utils/parseDate.js';

class Meeting {
    constructor({
        meeting_id,
        uuid,
        topic,
        start_time,
        join_url,
        status,
        duration,
        host_id,
        host_email,
        delay = false,
        delay_min = 0,
        summary = null,
        actualStartTime = null,
    }) {
        this.meeting_id = meeting_id;
        this.uuid = uuid;
        this.topic = topic;
        this.start_time = start_time;
        this.join_url = join_url || null;
        this.status = status;
        this.duration = duration;
        this.host_id = host_id;
        this.host_email = host_email;
        this.delay = delay || false;
        this.delay_min = delay_min || 0;
        this.summary = summary;
        this.actualStartTime = actualStartTime;
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
            start_time: obj?.start_time,
            join_url: obj?.join_url,
            status: obj?.status,
            duration: obj?.duration,
            host_id: obj?.host_id,
            host_email: obj?.host_email,
            summary: obj?.summary || null,
        });
    }

    static async getById(id) {
        const doc = await Meeting.collection().doc(id).get();
        if (!doc.exists) return null;
        return new Meeting({ id: doc.id, ...doc.data() });
    }

    static async getByMeetingId(meetingId) {
        const snapshot = await Meeting.collection()
            .where('meeting_id', '==', meetingId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
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

    static async updateStatusByMeetingId(meetingId, newStatus) {
        const snapshot = await Meeting.collection()
            .where('meeting_id', '==', meetingId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];

        await Meeting.collection().doc(doc.id).update({
            status: newStatus,
        });

        return { id: doc.id, status: newStatus };
    }

    static async updateSummaryByMeetingId(meeting_id, summary) {
        const snapshot = await Meeting.collection()
            .where('meeting_id', '==', meeting_id)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];

        await Meeting.collection().doc(doc.id).update({
            summary,
        });

        return { id: doc.id, meeting_id, summary };
    }

    static async updateMeetingByMeetingId(meetingId, dataToUpdate) {
        const snapshot = await Meeting.collection()
            .where('meeting_id', '==', meetingId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        await Meeting.collection().doc(doc.id).update(dataToUpdate);

        return { id: doc.id, ...dataToUpdate };
    }

    static async getAll() {
        const snapshot = await Meeting.collection().get();
        const meetings = [];

        snapshot.forEach(doc => {
            meetings.push(new Meeting({ id: doc.id, ...doc.data() }));
        });

        return meetings;
    }

    static async getLastMeetings(limit = 20) {
        const snapshot = await Meeting.collection()
            .orderBy('start_time', 'desc')
            .limit(limit)
            .get();

        const meetings = [];
        snapshot.forEach(doc => {
            meetings.push(new Meeting({ id: doc.id, ...doc.data() }));
        });

        return meetings;
    }

    static async getTodayMeetings() {
        const snapshot = await Meeting.collection()
            .orderBy('start_time', 'desc')
            .get();

        const meetings = [];

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        snapshot.forEach(doc => {
            const data = doc.data();
            const startTime = parseDate(data.start_time); // convierte a objeto Date

            if (startTime) {
                const meetingDateStr = startTime.toISOString().split('T')[0]; // YYYY-MM-DD
                if (meetingDateStr === todayStr) {
                    meetings.push(new Meeting({ id: doc.id, ...data }));
                }
            }
        });

        return meetings;
    }
    static async updateDelayByMeetingId(meetingId, delay, delay_min) {
        const snapshot = await Meeting.collection()
            .where('meeting_id', '==', meetingId)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];

        await Meeting.collection().doc(doc.id).update({
            delay,
            delay_min,
        });

        return { id: doc.id, delay, delay_min };
    }

    static async getGroupedDelaysByHostId() {
        const snapshot = await Meeting.collection()
            .where('delay', '==', true)
            .get();

        const delayMap = new Map();

        snapshot.forEach(doc => {
            const data = doc.data();
            const { host_id, delay_min } = data;

            if (!host_id) return;

            if (!delayMap.has(host_id)) {
                delayMap.set(host_id, {
                    host_id,
                    amount_delay: 0,
                    amount_delay_min: 0,
                });
            }

            const current = delayMap.get(host_id);
            current.amount_delay += 1;
            current.amount_delay_min += delay_min || 0;
        });

        // Enriquecer cada item con user_name y email
        const enriched = await Promise.all(
            Array.from(delayMap.values()).map(async (item) => {
                let user_name = null;
                let email = null;

                const host = await Participant.getHostByHostId(item.host_id);
                if (host) {
                    user_name = host.user_name || null;
                    email = host.email || null;
                }

                return {
                    ...item,
                    user_name,
                    email,
                };
            })
        );

        return enriched;
    }

    static async getTopDelayedHosts(limit) {
        const snapshot = await Meeting.collection()
            .where('delay', '==', true)
            .get();

        const delayMap = new Map();

        snapshot.forEach(doc => {
            const data = doc.data();
            const { host_id, delay_min } = data;

            if (!host_id) return;

            if (!delayMap.has(host_id)) {
                delayMap.set(host_id, {
                    host_id,
                    amount_delay: 0,
                    amount_delay_min: 0,
                });
            }

            const current = delayMap.get(host_id);
            current.amount_delay += 1;
            current.amount_delay_min += delay_min || 0;
        });

        // Enriquecer con nombre y email
        const enriched = await Promise.all(
            Array.from(delayMap.values()).map(async (item) => {
                let user_name = null;
                let email = null;

                const host = await Participant.getHostByHostId(item.host_id);
                if (host) {
                    user_name = host.user_name || null;
                    email = host.email || null;
                }

                return {
                    ...item,
                    user_name,
                    email,
                };
            })
        );

        // Ordenar por cantidad de tardanzas (desc)
        const sorted = enriched.sort((a, b) => b.amount_delay - a.amount_delay);

        // Si se pasa un limit, se aplica, si no, devuelve todo
        return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
    }

    static async getAllByHostId(hostId) {
        const snapshot = await Meeting.collection()
            .where('host_id', '==', hostId)
            .get();

        const meetings = [];
        snapshot.forEach(doc => {
            meetings.push(new Meeting({ id: doc.id, ...doc.data() }));
        });

        return meetings;
    }

    static async getHostsMoreInfo(limit) {
        const snapshot = await Meeting.collection()
            .get();

        const delayMap = new Map();

        snapshot.forEach(doc => {
            const data = doc.data();
            const { host_id, delay_min } = data;

            if (!host_id) return;

            if (!delayMap.has(host_id)) {
                delayMap.set(host_id, {
                    host_id,
                    amount_delay: 0,
                    amount_delay_min: 0,
                });
            }

            const current = delayMap.get(host_id);
            current.amount_delay += 1;
            current.amount_delay_min += delay_min || 0;
        });

        // Enriquecer con nombre, email, num_reuniones y promedio de rating
        const enriched = await Promise.all(
            Array.from(delayMap.values()).map(async (item) => {
                let user_name = null;
                let email = null;
                let num_reuniones = 0;
                let average = 0;

                // Nombre y email
                const host = await Participant.getHostByHostId(item.host_id);
                if (host) {
                    user_name = host.user_name || null;
                    email = host.email || null;
                }

                // Total reuniones
                const reuniones = await Meeting.getAllByHostId(item.host_id);
                num_reuniones = reuniones.length;

                // Calcular promedio rating
                const ratings = await Rating.getAllByHostId(item.host_id);
                if (ratings.length) {
                    const total = ratings.reduce((acc, r) => acc + (r.score || 0), 0);
                    average = parseFloat((total / ratings.length).toFixed(2));
                }

                return {
                    ...item,
                    num_reuniones,
                    average,
                    user_name,
                    email,
                };
            })
        );

        // Ordenar por cantidad de tardanzas (desc)
        const sorted = enriched.sort((a, b) => b.amount_delay - a.amount_delay);

        return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
    }

    static async deleteByMeetingId(meetingId) {
        const snapshot = await Meeting.collection()
            .where('meeting_id', '==', meetingId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        await Meeting.collection().doc(doc.id).delete();

        return { id: doc.id };
    }
}

export default Meeting;