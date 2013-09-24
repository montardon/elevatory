// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var floor = 0;

var calls = [];
var directions = [];
var gos = [];
var userHasEntered = false;
var userHasExited = false;
var doorsOpened = false;
var reachingUser = false;
var releasingUser = false;
var go = -1;

app.get('/call', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	calls.push(params['atFloor']);
	directions.push(params['to']);
	console.log("call "+params['atFloor']+" "+params['to']);
	console.log(calls);
	console.log(directions);
	res.writeHead(200);
	res.end();
});
app.get('/go', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	go = params['floorToGo'];
	gos.push(go);
	console.log("go "+go);
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
	var params = querystring.parse(url.parse(req.url).query);
	console.log("reset "+params['cause']+"==========================================");
	calls = [];
	directions = [];
	floor = 0;
	go = -1;
	userHasEntered = false;
	userHasExited = false;
	res.writeHead(200);
	res.end()
});
app.get('/nextCommand', function(req,res) {
	console.log("nextCommand");
	res.writeHead(200);
	if (calls.length>0 || go >= 0) {
		var dest = calls[0];
		if (go >= 0) {
			
			if (doorsOpened == true) {
				dest = go;
				res.end("CLOSE");
				doorsOpened = false;
			}
		} else {
			if (dest > floor) {
				floor++;
				console.log("UP");
				res.end("UP");				
			} else if (dest == floor) {
				// TODO: status door
				if (userHasEntered == true) {
					if (doorsOpened == true) {
						console.log("CLOSE");
						res.end("CLOSE");
						userHasEntered = false;
						doorsOpened = false;
					}
				} else 
				if (userHasExited == true) {
					if (doorsOpened == true) {
						console.log("CLOSE");
						res.end("CLOSE");
						userHasExited = false;
						doorsOpened = false;
					}
					
				} else {
					doorsOpened = true;
					console.log("OPEN");
					res.end("OPEN");
					go = -1;
					
				}
			} else {
				console.log("DOWN");			
				res.end("DOWN");				
				floor--;
			}
		}
	} else {
		console.log("NOTHING");
		res.end("NOTHING");
	}
	
});
app.listen(80);