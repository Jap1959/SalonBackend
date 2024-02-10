const axios = require('axios');
const qs = require('qs');

async function signInWithEmailAndPassword(email, password) {
    try {
        const requestBody = {
            email: email,
            password: password,
            returnSecureToken: true,
        };

        const API_KEY = process.env.APIKEY;

        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            qs.stringify(requestBody),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        const uid = response.data.localId;
        
        return ({ status: 200, uid: uid });
    } catch (error) {
        // Throw error if sign-in fails
        throw error;
    }
}

module.exports = { signInWithEmailAndPassword }
