const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var config  = require ('config');
const MongoClient = require('mongodb').MongoClient;

const mongo_url = config.get('mongo_url');
const mongo_dbname = config.get('mongo_db');
const colname = config.get('mongo_collection');

var app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/handler', (req, res) => {

  MongoClient.connect(mongo_url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(mongo_dbname);
    dbo.collection(colname).insertOne(req.body.data, function(err, res) {
      if (err) throw err;
      console.log("inserted - " + JSON.stringify(req.body.data));
      db.close();
    });
  });
  res.status(201).send(req.body.data);

});


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
  
module.exports = {app};