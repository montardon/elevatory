var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var floor = 0;

var users = [];
var directions = []
var userHasEntered = false;
var userHasExited = false;
var go = -1;

app.get('/call', function(req,res) {
	console.log("call");
	var params = querystring.parse(url.parse(req.url).query);
	users.push(params['atFloor']);
	directions.push(params['to']);
	console.log(users);
	console.log(directions);
	res.writeHead(200);
	res.end();
});
app.get('/go', function(req,res) {
	console.log("go");
	var params = querystring.parse(url.parse(req.url).query);
	go = params['floorToGo'];
	res.writeHead(200);
	res.end();
});
app.get('/userHasEntered', function(req,res) {
	console.log("userHasEntered");
	res.writeHead(200);
	res.end();
	userHasEntered = true;
});
app.get('/userHasExited', function(req,res) {
	console.log("userHasExited");
	userHasExited = true;
});
app.get('/reset', function(req,res) {
	console.log("reset ==========================================");
	users = [];
	directions = [];
	floor = 0;
	go = -1;
	userHasEntered = false;
	userHasExited = false;
	res.writeHead(200);
	res.end("")
});
app.get('/nextCommand', function(req,res) {
	console.log("nextCommand");
	res.writeHead(200);
	if (users.length>0 || go >= 0) {
		var dest = users[0];
		if (go >= 0) {
			dest = go;
			res.end("CLOSE");
		}
		if (dest > floor) {
			floor++;
			res.end("UP");
			console.log("UP");
		} else if (dest == floor) {
			// TODO: status door
			if (userHasEntered == true) {
				res.end("CLOSE");
				userHasEntered = false;
				console.log("CLOSE");
			} else 
			if (userHasExited == true) {
				res.end("CLOSE");
				userHasExited = false;
				console.log("CLOSE");
			} else {
				res.end("OPEN");
				go = -1;
				console.log("OPEN");
			}
		} else {
			res.end("DOWN");
			console.log("DOWN");			
			floor--;
		}
	}
	
	
});
app.listen(80);