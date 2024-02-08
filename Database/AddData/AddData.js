const admin = require('firebase-admin');
const { SendEmail, ConfirmationEmail } = require('../../SendEmail');
const db = admin.firestore();
function AddRequest(data) {
    try {
        if (Servicetype == 'Door to Door') {
            const docRef = db.collection('users').doc();
            const result = docRef.set({
                Reqid: docRef.id,
                Email: data.Email,
                Name: data.Name,
                PhoneNumber: data.Phone,
                Service: data.Service,
                date: data.date,
                Servicetype: data.Servicetype,
                Address: data.Address,
                RequestStatus: -1,
            });
            console.log(result);
            const res = SendEmail(data, Reqid);
            if (res.status == 200) {
                return ({ status: 200, message: 'Request Sent Successfully' });
            }
        } else {
            const docRef = db.collection('users').doc();
            const result = docRef.set({
                Reqid: docRef.id,
                Email: Email,
                Name: Name,
                PhoneNumber: Phone,
                Service: Service,
                date: date,
                Servicetype: Servicetype,
                RequestStatus: -1,
            });
            console.log(result);
            const res = SendEmail(Email, Name, Service, Servicetype, date, Reqid);
            if (res.status == 200) {
                return ({ status: 200, message: 'Request Sent Successfully' });
            }
        }
    } catch (e) {
        console.log(e);
    }
}
const UpdateStatus = async (RequestStatus, Reqid) => {
    try {
        const docSnapshot = await db.collection('Requests').doc(Reqid).get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const newData = {
                field1: RequestStatus === true ? 1 : 0,
            };
            await collectionRef.doc(documentId).update(newData);
            if (RequestStatus === true && data.Servicetype === 'Door to Door') {
                const Address = data.address;
                const res = ConfirmationEmail(data, data.Address);
                if (res.status == 200) {
                    return ({ status: 200, message: 'updated successfully' });
                } else {
                    return ({ status: 422, message: 'Some Error Occured.Try again later!' });
                }
            }
            else if (RequestStatus === true) {
                const res = ConfirmationEmail(data, process.env.ADDRESS);
                if (res.status == 200) {
                    return ({ status: 200, message: 'updated successfully' });
                } else {
                    return ({ status: 422, message: 'Some Error Occured.Try again later!' });
                }
            }
            console.log('Document updated successfully');
        } else {
            console.log('Document does not exist');
        }
    } catch (e) {
        console.log(e);
    }
}
module.exports = { AddRequest, UpdateStatus };