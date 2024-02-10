const admin = require('firebase-admin');
const fs = require('fs');
const { SendEmail, ConfirmationEmail } = require('../../SendEmail');
const db = admin.firestore();
async function AddRequest(data) {
    try {
        if (data.Servicetype == 'Door to Door') {
            const docRef = db.collection('Requests').doc();

            const result = docRef.set({
                Reqid: docRef.id,
                Email: data.Email,
                Name: data.Name,
                PhoneNumber: data.Mobile,
                Service: data.Service,
                date: data.date,
                Servicetype: data.Servicetype,
                Address: data.Address,
                RequestStatus: -1,
                Read: 0,
            });
            console.log(result);
            const res = SendEmail(data, docRef.id);
            if (res.status == 200) {
                return (res);
            }
        } else {
            const docRef = db.collection('Requests').doc();
            const result = docRef.set({
                Reqid: docRef.id,
                Email: data.Email,
                Name: data.Name,
                PhoneNumber: data.Mobile,
                Service: data.Service,
                date: data.date,
                Servicetype: data.Servicetype,
                RequestStatus: -1,
                Read: 0,
            });
            const res = await SendEmail(data, docRef.id);
            if (res.status == 200) {
                return (res);
            }
        }
    } catch (e) {
        console.log(e);
    }
}
const UpdateStatus = async (RequestStatus, Reqid) => {
    try {
        console.log(RequestStatus);
        console.log(Reqid);
        const docSnapshot = await db.collection('Requests').doc(Reqid).get();

        if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const newData = {
                RequestStatus: RequestStatus === true ? 1 : 0,
                Read: 1,
            };
            await db.collection('Requests').doc(Reqid).update(newData);
            if (RequestStatus === true && data.Servicetype === 'Door to Door') {
                const Address = data.address;
                const res = await ConfirmationEmail(data, Address);
                if (res.status == 200) {
                    return ({ status: 200, message: 'updated successfully' });
                } else {
                    return ({ status: 422, message: 'Some Error Occured.Try again later!' });
                }
            }
            else if (RequestStatus === true) {
                const res = await ConfirmationEmail(data, process.env.ADDRESS);
                console.log(res);
                if (res.status == 200) {
                    return ({ status: 200, message: 'updated successfully' });
                } else {
                    return ({ status: 422, message: 'Some Error Occured.Try again later!' });
                }
            }
        } else {
            console.log('Document does not exist');
        }
    } catch (e) {
        console.log(e);
    }
}


async function uploadImage() {
    const filePath = `D:/SalonBackend/uploads/photo.jpeg`;
    const destinationPath = `Review/Review_${Date.now()}`;
    const bucket = admin.storage().bucket();
    const data = fs.readFileSync(filePath);
    const file = bucket.file(destinationPath);
    await file.save(data, {
        metadata: {
            contentType: 'image/jpeg'
        }
    });

    await file.makePublic();

    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2025'
    });

    console.log('File uploaded successfully.');
    return url;
}


async function storeData(name, review, imageUrl) {
    const reviewData = {
        name: name,
        review: review,
        imageUrl: imageUrl,
    };

    await admin.firestore().collection('reviews').add(reviewData);

    return { status: 200, message: 'Review Added' };
}
async function uploadImageAndStoreData(name, review) {

    try {
        const imageUrl = await uploadImage();
        const result = await storeData(name, review, imageUrl);
        return { status: 200, message: 'Review Added' };
    } catch (error) {
        console.error('Error uploading image and storing data:', error);
        return { status: 422, message: 'Something went wrong' };
        throw error;
    }
}
module.exports = { AddRequest, UpdateStatus, uploadImageAndStoreData };