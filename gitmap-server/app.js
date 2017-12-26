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

// var geoSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     default: 'Point'
//   },
//   coordinates: {
//     type: [Number],
//     index: '2d'
//   }
// });
//
// var schema = new Schema({
//   username: {
//     type: String,
//     required: [true, 'Username is required.']
//   },
//   url: {
//     type: String,
//     required: [true, 'URL is required.']
//   },
//   reponame: {
//     type: String,
//     required: [true, 'RepoName is required.']
//   },
//   location: geoSchema
// });

var projectsModel = mongoose.model('Project', schema);

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

app.get('/projects', function(req, res, next) {
  // var lng = req.query.lng;
  // var lat = req.query.lat;
  // var limit = req.query.limit || 20;
  // limit = parseInt(limit);
  // var maxDistance = req.query.distance || 500000000;
  // maxDistance /= 6378.1;
  // var coords = [lng, lat];
  // projectsModel.find({
  //   location: {
  //     $near: coords,
  //     $maxDistance: maxDistance
  //   }
  // }, function(err, projects) {
  //   if (err){
  //      res.send(err);
  //   } else {
  //     res.send(projects);
  //   }
  // }).limit(limit);
  // projectsModel.geoNear(
  //       {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
  //       {spherical: true}
  //   ).then(function(projs){
  //       res.send(projs);
  //   }).catch(next);

  var lng = req.query.lng;
  var lat = req.query.lat;

  projectsModel.aggregate([
    { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [-95.4869710, 30.0138430]
            },
            "distanceField": "distance",
            "spherical": true,
            "maxDistance": 1090
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
