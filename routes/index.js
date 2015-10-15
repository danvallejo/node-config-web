var express = require('express');
var router = express.Router();

var querystring = require('querystring');

var http = require('http');

var host = 'localhost';

function performRequest(host, port, endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  
  var options = {
    host: host,
	port: port,
    path: '/config',
    method: 'GET',
    headers: headers
  };

  console.log("Options: " + JSON.stringify(options, null, 2));
  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

router.get('/', function(req, res, next) {
	performRequest('localhost', 8000, '/config', 'GET', {data: 'data'}, function(data){
		console.log('performRequest');
		console.log(JSON.stringify(data,null,2));
		res.render('index', { title: 'Express', data: data });
	  });	
});

router.use(logErrors);

function logErrors(error, request, response, next)
{
	console.error('error:' + JSON.stringify(error, null, 2));
	next(error)
}

module.exports = router;
