// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var floor = 0;
var step = 0;
var direction = "UP";

app.get('/call', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	res.writeHead(200);
	res.end();
	console.log("call "+params['atFloor']+" "+params['to']);
});
app.get('/go', function(req,res) {
	res.writeHead(200);
	res.end();
	var params = querystring.parse(url.parse(req.url).query);
	console.log("go "+params['floorToGo']);
});
app.get('/userHasEntered', function(req,res) {
	res.writeHead(200);
	res.end();
	console.log("userHasEntered");
});
app.get('/userHasExited', function(req,res) {
	res.writeHead(200);
	res.end();
	console.log("userHasExited");
});
app.get('/reset', function(req,res) {
	res.writeHead(200);
	res.end();
	var params = querystring.parse(url.parse(req.url).query);
	console.log("reset "+params['cause']+"==========================================");
	floor = 0;
	step = 0;
});
app.get('/nextCommand', function(req,res) {
	console.log("nextCommand");	
	res.writeHead(200);
	if (step == 0) {
		res.end("OPEN");
		step =1;
		console.log("OPEN");
	} else if (step == 1) {
		res.end("CLOSE");
		step =2;
		console.log("CLOSE");
	} else if (step ==2) {
		console.log("Floor: "+floor);
		if (floor == 5 && direction == "UP") {
			direction = "DOWN";
		}
		if (floor == 0 && direction == "DOWN") {
			direction = "UP";
		}
		if (direction == "DOWN") {
			floor--;
			res.end("DOWN");
			console.log("DOWN");
		} else if (direction == "UP") {
			floor++;
			res.end("UP");
			console.log("UP");
		}
		step = 0;
	}	
});
app.listen(80);