const admin = require('firebase-admin');
const db = admin.firestore();
function GetRequest() {
    try {
        const result = db.collection('Requests').get();
        return ({ status: 200, Data: result });
    } catch (e) {
        console.log(e);
    }
}
module.exports = { GetRequest };