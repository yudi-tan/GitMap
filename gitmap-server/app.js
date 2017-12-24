var express = require('express');

var app = express();

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
      res.send('error');
    } else {
        res.send(proj);
    }
    })
});

var server = app.listen(5000, function() {
  console.log('Express server listening on port ' + 5000);
});

module.exports = app;
