import db from "../../../config/firebase/firebase.js";

class User {
    constructor({
        email,
        username
    }) {
        this.email = email;
        this.username = username;
    }

    static collection() {
        return db.collection('usuarios');
    }

    static fromZoomPayload(payload) {
        const obj = payload?.object;

        return new User({
            email: obj?.email,
            username: obj?.username
        });
    }

    static async getByEmail(email) {
        const snapshot = await User.collection()
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return new User({ id: doc.id, ...doc.data() });
    }
}

export default User;    