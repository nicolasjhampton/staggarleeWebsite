'use strict';

var express = require('express'),
    billboards = require('./data/billboards.json'),
    row1 = require('./data/row-1-col-3.json'),
    row2 = require('./data/row-2-col-1.json');
    //comment is in reference to $ npm install node-rest-client --save

var request = require('request');

var billboardsList = Object.keys(billboards).map(function (value) {
  return billboards[value];
});

var row1List = Object.keys(row1).map(function (value) {
  return row1[value];
});

var app = express();

app.use('/static', express.static(__dirname + '/libs'));
app.use('/static', express.static(__dirname + '/public'));

//setting the template engine to jade
app.set('view engine', 'jade');
app.set('views', __dirname + '/views/layouts');

app.get('/', function (request, response){
  var path = "/home";
  response.render('main', {billboards:billboardsList, row1:row1List, row2:row2, path:path});

});

app.get('/home', function (request, response) {
  var path = request.path;
  response.render('main', {billboards:billboardsList, row1:row1List, row2:row2, path:path});

});

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
  response.render('about', {path:path});

});

app.get('/projects', function (requests, response) {
  // get the path so we can set the active link in template
  var path = requests.path;

  // set variables to hold json response from github
  var javaProjects = [];
  var javascriptProjects = [];
  var htmlProjects = [];
  var otherLangProjects = [];

  var options = {
    url: 'https://api.github.com/users/nicolasjhampton/repos',
    headers: {
      'User-Agent': 'nicolasjhampton'
    }
  };



  // request json project data from github
  request(options, function(error, gitResponse, body) {

    var body = JSON.parse(body);
    if(!error && gitResponse.statusCode == 200){

      // split each project into its indivisual language
      for (var index = 0; index < body.length; ++index) {

        switch(body[index].language) {

          //Java, JavaScript, HTML, and (other)
          case "Java":
            javaProjects.push(body[index]);
            break;
          case "JavaScript":
            javascriptProjects.push(body[index]);
            break;
          case "HTML":
            htmlProjects.push(body[index]);
            break;
          default:
            otherLangProjects.push(body[index]);
            break;

        }
      }

      var projects = {
        "html": htmlProjects,
        "javascript": javascriptProjects,
        "java": javaProjects,
        "otherLang": otherLangProjects
      }


      // render the template, sending the project data
      response.render('projects', {path:path,
                      projects:projects});
    }
  });

  // Handle any timeout from github
  //gitRequest.on('requestTimeout', function(timeoutResponse) {
    //response.render('projects', {path:path, timeout:timeoutResponse});
  //});

  // Handle any error sent from github
  //gitRequest.on('error', function(error) {
    //response.render('projects', {path:path, error:error});
  //});

});

app.get('/publications', function (request, response) {
  var path = request.path;
  response.render('publications', {path:path});

});


app.listen(3000, function() {
  console.log('Express is running a Frontend server on port 3000');
});
