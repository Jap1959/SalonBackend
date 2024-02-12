const axios = require('axios');
const qs = require('qs');
const { GenerateToken } = require('./jwt');

async function signInWithEmailAndPassword(email, password) {
    try {
        const requestBody = {
            email: email,
            password: password,
            returnSecureToken: true,
        };

        const API_KEY = process.env.APIKEY;
        try {
            const response = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
                qs.stringify(requestBody),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            
            const result = await GenerateToken(email);
            return ({ status: 200, jwt: result });

        } catch (e) {
            console.log(e);
            return ({ status: 422, message: 'Incorrect Email/Password!' });
        }

    } catch (error) {
        // Throw error if sign-in fails
        throw error;
    }
}

module.exports = { signInWithEmailAndPassword }
