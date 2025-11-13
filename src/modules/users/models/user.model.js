import { supabase } from "../../../config/supabase/supabase.js";

class User {
    constructor({
        email,
        username
    }) {
        this.email = email;
        this.username = username;
    }

    /**
     * Finds a user by their email.
     * Since there isn't a dedicated 'users' table, this method queries the 'reuniones'
     * table to find a record associated with the host's email.
     * We assume host_id can be used as the username.
     * @param {string} email The email of the user to find.
     * @returns {Promise<User|null>} A User object or null if not found.
     */
    static async getByEmail(email) {
        const { data, error } = await supabase
            .from('reuniones') // Assumes user information is in the 'reuniones' table
            .select('host_email, host_id')
            .eq('host_email', email)
            .limit(1)
            .single();

        // .single() returns null if no row is found, which is the desired behavior.
        // We only need to throw an error if something else went wrong.
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user by email:', error);
            throw new Error(error.message);
        }

        if (!data) {
            return null;
        }

        // Create a User instance from the retrieved data
        return new User({ email: data.host_email, username: data.host_id });
    }
}

export default User;