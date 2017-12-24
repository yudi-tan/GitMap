var bodyParser = require('body-parser');

var express = require('express');

var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');

var credentials = require('./mlabconfig');

var dbuser = credentials.username;

var dbpassword = credentials.password;

mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds125556.mlab.com:25556/gitmap`, {useMongoClient: true});

var schema = new mongoose.Schema({ username: 'string', url: 'string', latitude: 'string', longitude: 'string' });

var projectsModel = mongoose.model('Project', schema);

app.get('/projects', function(req, res) {
  projectsModel.find({}, function(err, proj) {
    if(err){
      console.log(err);
      res.send('error in GET');
    } else {
        res.send(proj);
    }
    })
});

app.post('/newproject', function(req, res) {
  var data = {
    username: req.body.username,
    url: req.body.url,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  };
  projectsModel.create(data, (err, proj) => {
    if (err) {
      res.send('error in POST');
    } else {
      res.send(data);
    };
  });
})

var server = app.listen(5000, function() {
  console.log('Express server listening on port ' + 5000);
});

module.exports = app;
