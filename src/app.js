'use strict';

var express = require('express'),
    billboards = require('./data/billboards.json'),
    row1 = require('./data/row-1-col-3.json'),
    row2 = require('./data/row-2-col-1.json'),
    about = require('./data/about.json');

var gig;

var bodyParser = require('body-parser');

var request = require('request');

var billboardsList = Object.keys(billboards).map(function (value) {
  return billboards[value];
});

var row1List = Object.keys(row1).map(function (value) {
  return row1[value];
});

var app = express();

app.set('port', (process.env.PORT || 5000));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/static', express.static(__dirname + '/libs'));
app.use('/static', express.static(__dirname + '/public'));


//setting the template engine to jade
app.set('view engine', 'jade');
app.set('views', __dirname + '/views/layouts');

var parse = function(requests, response, next) {
  gig = JSON.stringify(requests.body);

  var options = {
    url: "",
    method: "POST",
    headers: {
      "X-Parse-Application-Id": "",
      "X-Parse-REST-API-Key": "",
      "Content-Type": "application/json"
    },
    body: gig
  };

  request(options);
  next();

};

var root = function (request, response){
  var path = "/home";
  response.render('main', {billboards:billboardsList, row1:row1List, row2:row2, path:path});

};


app.get('/', root);

app.get('/home', root);

app.post('/', urlencodedParser, [parse, root]);

app.get('/blog', function (request, response) {
  var path = request.path;
  response.render('blog', {path:path});

});

app.get('/contact', function (request, response) {
  var path = request.path;
  response.render('contact', {path:path});

});

app.get('/about', function (request, response) {
  var path = request.path;
  response.render('about', {path:path, about:about});

});

app.get('/projects', function (requests, response) {

  // get the path so we can set the active link in template
  var path = requests.path;

  // set github variables for request method
  var options = {
    url: 'https://api.github.com/users/nicolasjhampton/repos',
    headers: {
      'User-Agent': 'nicolasjhampton'
    }
  };

  // request json project data from github
  request(options, function(error, gitResponse, body) {

    // check for a successful response
    if(!error && gitResponse.statusCode == 200){

      // parse the body of the response into valid JSON
      var body = JSON.parse(body);

      // render the template, sending the project data
      response.render('projects', {path:path,
                      projects:body});

    }
  });
});

app.get('/publications', function (request, response) {
  var path = request.path;
  response.render('publications', {path:path});

});


app.listen(app.get('port'), function() {
  console.log('Express is running a Frontend server on port 3000');
});
