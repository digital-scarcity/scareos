const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var app = express();
const port = 4000;

app.use(bodyParser.json());

app.post('/handler', (req, res) => {
    console.log (req.body.data);
});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  
module.exports = {app};