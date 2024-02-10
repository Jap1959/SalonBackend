const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
require('dotenv').config();
var admin = require("firebase-admin");
var serviceAccount = require(process.env.DATABASEURL);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET,
});
const multer = require('multer');


const AddData = require('./Database/AddData/AddData.js');
const { GetRequest, GetTestimontials, } = require('./Database/GetData/GetDataValues.js');
const { signInWithEmailAndPassword } = require('./Database/Authentication/Auth.js');
const { SendContactEmail } = require('./SendEmail.js');
app.get('/', (req, res) => {
    res.send('Connected!!!!!');
});
app.get('/Request/:id', async (req, res) => {
    const PageNumber = parseInt(req.params.id);
    const result = await GetRequest(PageNumber);
    res.send(result);
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads`);
    },
    filename: (req, file, cb) => {
        cb(null, `photo.jpeg`);
    },
});
const upload = multer({ storage: storage });
app.post('/reviews', upload.single('photo'), async (req, res) => {
    await AddData.uploadImageAndStoreData(req.body.name, req.body.review).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });

});
app.get('/testimonials', async (req, res) => {
    const result = await GetTestimontials();
    res.send(result);
});
app.post('/RequestStatus', async (req, res) => {
    const result = await AddData.UpdateStatus(req.body.status, req.body.Reqid);
    res.send(result);
});
app.post('/SendEmail', async (req, res) => {
    const result = await SendContactEmail(req.body);
    res.send(result);
});
app.get('/isLogin', async (req, res) => {
    if (req.cookies.login != undefined) {
        const login = req.cookies.login;
        res.send({ status: 200, login: true });
    } else {
        res.send({ status: 200, login: false });
    }
});
app.post('/Login', async (req, res) => {
    console.log(req.body);
    const result = await signInWithEmailAndPassword(req.body.Email, req.body.Password);
    if (result.status === 200) {
        res.cookie('login', true, {
            expires: new Date(Date.now() + 25892000000),
            secure: true,
        });
    }
    console.log(req.cookies.login);
    res.send(result);
});
app.post('/Book', async (req, res) => {
    console.log(req.body);
    const data = req.body;
    const result = await AddData.AddRequest(data);
    res.send(result);
});
app.listen(5000, () => {
    console.log('listening on 5000');
});