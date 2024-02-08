const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();
var admin = require("firebase-admin");
var serviceAccount = require("./salon-79d62-firebase-adminsdk-px8bi-3407d37672.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const AddData = require('./Database/AddData/AddData.js');
app.get('/', (req, res) => {
    res.send('Connected!!!!!');
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