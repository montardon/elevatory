// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var floor = 0;

var users = [];
var directions = []
var userHasEntered = false;
var userHasExited = false;
var doorsOpened = false;
var go = -1;

app.get('/call', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	users.push(params['atFloor']);
	directions.push(params['to']);
	console.log("call "+params['atFloor']+" "+params['to']);
	console.log(users);
	console.log(directions);
	res.writeHead(200);
	res.end();
});
app.get('/go', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	go = params['floorToGo'];
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
	res.writeHead(200);
	res.end();
	userHasExited = true;
	go = -1;
	users.splice(0,1);
});
app.get('/reset', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	console.log("reset "+params['cause']+"==========================================");
	users = [];
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
	
	var command = "NOTHING";
	if (users.length>0 || go >= 0) {
		var dest = users[0];
		if (go >= 0) {
			dest = go;
		}
		
		if (doorsOpened == true) {
			command = "CLOSE";
			doorsOpened = false;
		} else {
			if (dest > floor) {
				floor++;
				command = "UP";
			} else if (dest == floor) {
				// TODO: status door
				console.log("Floor ok");
				if (userHasEntered == true && doorsOpened == true) {
						command = "CLOSE";
						userHasEntered = false;
						doorsOpened = false;
				} else if (userHasExited == true && doorsOpened == true) {
						command = "CLOSE";
						userHasExited = false;
						doorsOpened = false;
				} else {
					doorsOpened = true;
					command = "OPEN";
					go = -1;
				}
			} else {
				command = "DOWN";
				floor--;
			}
		}
	}
	
	console.log(command);
	res.end(command);
	
	
});
app.listen(80);
