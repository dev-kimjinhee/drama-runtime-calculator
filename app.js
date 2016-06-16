'use strict';

var express = require('express');
var path = require('path');
var body_parser = require('body-parser');
var http = require('http');
var request = require('request');

var app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', './views');

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.get('/', function(req, res) {
  res.render('index', {title:'Express'});
});

app.get('/search', function(req, res) {
  
  // search drama title
  var search_title = req.body.search_title; 

  // movie DB key
  var api_key = 'f073217cc9ebdffe91577b5c969ac1a3';
  
  var object = request({
    method: 'GET',
    url: 'http://api.themoviedb.org/3/search/tv?query=' + search_title + '&api_key=' + api_key,
    headers: {
      'Accept': 'application/json'
    }}, function (error, response, body) {
      if(!error && response.statusCode == 200){
        res.send('Status:' + response.statusCode + '<br>Headers:' + JSON.stringify(response.headers));
        console.log('Response:', body);
        // var original = JSON.parse(body);
        // var result = {
        //   list: original.list,
        //   aaaa: original.aaa
        // };
        // res.send(JSON.stringify(result));
        // res.json(result);
      }else{
        res.send('bad request!!');
      }
  );
});



app.listen(3005, function() {
  console.log('Connected 3005');
});
