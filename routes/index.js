var express = require('express');
var router = express.Router();

var querystring = require('querystring');

var https = require('https');

var host = 'localhost';

function performRequest(endpoint, method, data, success) {
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
    host: 'configuration-service-0.elasticbeanstalk.com',
	port: 80,
    path: '/config',
    method: 'GET',
    headers: headers
  };

  var req = https.request(options, function(res) {
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
//performRequest('/config', 'GET', {data: 'data'}, function(data){
//	  console.log(data);
//  });
	
  res.render('index', { title: 'Express' });
});

router.use(logErrors);

function logErrors(error, request, response, next)
{
	console.error('error:' + JSON.stringify(error, null, 2));
	next(error)
}

module.exports = router;
