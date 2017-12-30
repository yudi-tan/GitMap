var bodyParser = require('body-parser');

var express = require('express');

var app = express();

var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var credentials = require('./mlabconfig');

var dbuser = credentials.username;

var dbpassword = credentials.password;

mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds125556.mlab.com:25556/gitmap`, {useMongoClient: true});

var schema = new mongoose.Schema({ username: 'string', url: 'string', reponame: 'string', loc: {
  type: { type: 'string', default: 'Point' },
  coordinates: ['number']
} });

schema.index({ "loc": "2dsphere" });

var projectsModel = mongoose.model('Project', schema);

//GET all projects
app.get('/allprojects', function(req, res) {
  projectsModel.find({}, function(err, proj) {
    if(err){
      console.log(err);
      res.send('error in GET');
    } else {
        res.send(proj);
    }
    })
});

//GET all projects of ONE user
app.get('/user', function(req, res) {
  var username = req.query.id;
  projectsModel.find({username}, function(err, proj) {
    if(err){
      console.log(err);
      res.send('error in GET');
    } else {
        res.send(proj);
    }
    })
});

//POST / CREATE (upload) a new project
app.post('/newproject', function(req, res) {
  var data = {
    username: req.body.username,
    reponame: req.body.reponame,
    url: req.body.url,
    loc: {coordinates: [req.body.longitude, req.body.latitude]}
  };
  projectsModel.create(data, (err, proj) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    };
  });
})

//DELETE a project
app.delete('/project/:id', function(req, res) {
  projectsModel.remove({_id: req.params.id}, function(err, proj){
    if(err){
      res.send(err);
    } res.json({ message: 'Successfully deleted '})
  })
})


//GET projects that are within maxDistance of lng and lat
app.get('/projects', function(req, res, next) {

  var lng = req.query.lng;
  var lat = req.query.lat;
  var maxDistance = req.query.dist || 50000; //default to 50 km
  var limit = req.query.limit || 20;
  if (!lng || !lat) {
    res.send('no longitude / latitude given');
  }

  projectsModel.aggregate([
    { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [parseFloat(lng), parseFloat(lat)]
            },
            "distanceField": "distance",
            "spherical": true,
            "maxDistance": parseFloat(maxDistance),
            "limit": parseInt(limit)
        }}
  ],
  function(err, projs) {
    if(err){
      console.log(err);
    } else {
      res.send(projs);
    }
  })


});


var port = process.env.PORT || 5000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + 5000);
});

module.exports = app;
