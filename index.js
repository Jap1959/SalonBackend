const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { SendEmail } = require('./SendEmail');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


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
app.listen(5000, () => {
    console.log('listening on 5000');
});