// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var elevatorStateModule = require('./ElevatorStateFIFO');

var elevator = new elevatorStateModule.ElevatorState();

app.get('/call', function(req,res) {
	console.log("-> CALL");
	
	var params = querystring.parse(url.parse(req.url).query);
	var call = new elevatorStateModule.call(parseInt(params['atFloor']), params['to']);
	
	elevator.addCall(call);
	
	console.log("> CALL "+params['atFloor']+" "+params['to']);
	console.log(elevator.calls);

	res.writeHead(200);
	res.end();
});
app.get('/go', function(req,res) {
	console.log("-> GO");
	var params = querystring.parse(url.parse(req.url).query);
	var user = new elevatorStateModule.user(parseInt(params['floorToGo']));
	
	elevator.addUser(user);
	
	console.log("> USER "+params['floorToGo']);
	console.log(elevator.users);
	
	res.writeHead(200);
	res.end();
});
app.get('/userHasEntered', function(req,res) {
	console.log("-> USER IN");
	elevator.userEntered();
	
	console.log("> userHasEntered");
	console.log(elevator.calls);
	
	res.writeHead(200);
	res.end();
});
app.get('/userHasExited', function(req,res) {
	console.log("->USER OUT");
	elevator.userExited();
	
	console.log("> userHasExited");
	console.log(elevator.users);
	res.writeHead(200);
	res.end();
});
app.get('/reset', function(req,res) {
	console.log("->RESET");
	var params = querystring.parse(url.parse(req.url).query);
	console.log("reset "+params['cause']+"==========================================");
	
	elevator = new elevatorStateModule.ElevatorState();
	console.log(elevator.currentFloor);
	res.writeHead(200);
	res.end()
});
app.get('/nextCommand', function(req,res) {
	console.log("-> nextCommand");
	res.writeHead(200);
	res.end(elevator.nextCommand());
});
app.listen(80);