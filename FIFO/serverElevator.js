// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var elevatorStateModule = require('./ElevatorStateFIFO');

var elevator = new elevatorStateModule.ElevatorState();

app.get('/call', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	var call = new elevatorStateModule.call(parseInt(params['atFloor']), params['to']);
	
	elevator.addCall(call);
	
	console.log("call "+params['atFloor']+" "+params['to']);
	console.log(elevator.calls);

	res.writeHead(200);
	res.end();
});
app.get('/go', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	var user = new elevatorStateModule.user(parseInt(params['floorToGo']));
	
	elevator.add(user);
	
	res.writeHead(200);
	res.end();
});
app.get('/userHasEntered', function(req,res) {
	elevator.userEntered();
	
	console.log("userHasEntered");
	res.writeHead(200);
	res.end();
	userHasEntered = true;
});
app.get('/userHasExited', function(req,res) {
	elevator.userExited();
	
	console.log("userHasExited");
	userHasExited = true;
});
app.get('/reset', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	console.log("reset "+params['cause']+"==========================================");
	
	elevator = new elevatorStateModule.ElevatorState();
	console.log(elevator.currentFloor);
	res.writeHead(200);
	res.end()
});
app.get('/nextCommand', function(req,res) {
	console.log("nextCommand");
	res.writeHead(200);
	
	res.end(elevator.nextCommand());
});
app.listen(80);