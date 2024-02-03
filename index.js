const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { SendEmail } = require('./SendEmail');
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require('cors');
const { SendAcceptEmail } = require('./SenAcceptEmail');
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Connected!!!!!');
});
app.post('/Book', async (req, res) => {
    console.log(req.body);
    const Email = req.body.Email;
    const Service = req.body.Service;
    const Name = req.body.Name;
    const Time = req.body.Time;
    const date = req.body.Date;
    const Phone = req.body.Phone;
    const result = await SendEmail(Email, Phone, Service, Name, Time, date);
    console.log(result);
    res.send(result);
});
app.get('/Acccept/:Name/:Email/:Date/:Time/:Service', async (req, res) => {
    console.log(req.body);
    const Email = req.params.Email;
    const Name = req.params.Name;
    const Date = req.params.Date;
    const Time = req.params.Time;
    const Service = req.params.Service;
    const result = await SendAcceptEmail(Email,Service, Name, Time, Date);
    res.send(result);
});
app.listen(5000, () => {
    console.log('listening on 5000');
});