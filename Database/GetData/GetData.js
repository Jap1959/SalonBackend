const admin = require('firebase-admin');
const db = admin.firestore();
async function GetRequest(PageNumber) {
    try {
        const pageSize = 9;
        const snapshot = await db.collection('Requests').count().get();
        const Pages = snapshot.data().count;
        const TotalPages = Math.ceil(Pages / pageSize);
        const result2 = db.collection('Requests')
            .orderBy('date', 'desc')
            .offset((PageNumber - 1) * pageSize)
            .limit(pageSize)
            .get()
            .then(docsSnapshot => {
                const data = docsSnapshot.docs.map(doc => doc.data());
                return { status: 200, Data: data, Pages: TotalPages };
            })
            .catch(error => {
                console.error('Error getting documents: ', error);
                return { status: 500, error: 'Internal Server Error' };
            });
        return result2;
    } catch (e) {
        console.log(e);
    }
}
async function GetTestimontials() {
    try {
        const testimonialsSnapshot = await db.collection('reviews').get();
        const testimonials = [];
        testimonialsSnapshot.forEach((doc) => {
            testimonials.push(doc.data());
        });
        return ({ status: 200, Data: testimonials });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
}

module.exports = { GetRequest,GetTestimontials };