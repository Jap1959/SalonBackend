const jwt = require('jsonwebtoken');
const GenerateToken = async (Email) => {
    try {
        let token = jwt.sign({ email: Email }, process.env.SCERET_KEY);
        return token;
    } catch (err) {
        console.log(err);
    }
}
const GetTokenDetails = async (token) => {
    try {
        if (token !== null) {
            const decodedtoken = jwt.verify(token, process.env.SCERET_KEY);
            if (decodedtoken.email === 'miliismakeover78@gmail.com')
                return ({ status: 200, login: true });
        } else {
            return ({ status: 200, login: false });
        }
    } catch (error) {
        console.log(error);
        return ({ status: 200, login: false });
    }

}
module.exports = { GenerateToken, GetTokenDetails };