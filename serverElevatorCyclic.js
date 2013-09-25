// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var floor = 0;
var step = 0;
var direction = "UP";

var calls = [];
var directions = [];
var gos = [];

var min = 0;
var max = 5;

var updateMinMax = function(userCalls,userGos) {
	var maxCalls = Math.max.apply(Math, userCalls);
	max = maxCalls;
	var maxGos = Math.max.apply(Math,userGos);
	if (maxGos > max) {
		max = maxGos;
	}
	var minCalls = Math.min.apply(Math, userCalls);
	min = minCalls;
	var minGos = Math.min.apply(Math,userGos);
	if (minGos < min) {
		min = minGos;
	}
};


app.get('/call', function(req,res) {
	var params = querystring.parse(url.parse(req.url).query);
	calls.push(parseInt(params['atFloor'],10));
	res.writeHead(200);
	res.end();
	updateMinMax(calls,gos);
	console.log("call "+params['atFloor']+" "+params['to']);
	console.log("Calls "+calls);
	console.log("Gos "+gos);
});
app.get('/go', function(req,res) {
	res.writeHead(200);
	res.end();
	var params = querystring.parse(url.parse(req.url).query);
	gos.push(parseInt(params['floorToGo'],10));
	updateMinMax(calls,gos);
	console.log("go "+params['floorToGo']);
	console.log("Calls "+calls);
	console.log("Gos "+gos);
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
	min = 0;
	max = 5;
	calls = [];
	gos = [];
});
app.get('/nextCommand', function(req,res) {
	console.log("nextCommand");	
	res.writeHead(200);
	if (step == 0) {
	/*
		if (calls.indexOf(floor.toString()) === -1 || gos.indexOf(floor.toString()) === -1) {
			res.end("NOTHING");
			console.log("NOTHING");
		} else {
		*/
			res.end("OPEN");
			console.log("OPEN");
			var indexGos = gos.indexOf(floor);
			gos.splice(indexGos, 1);
			var indexCalls = calls.indexOf(floor);
			calls.splice(indexCalls, 1);
			console.log("Calls "+calls);
			console.log("Gos "+gos);
		/*}*/
		step =1;

	} else if (step == 1) {
		/*if (calls.indexOf(floor.toString()) === -1 || gos.indexOf(floor.toString()) === -1) {
			res.end("NOTHING");
			console.log("NOTHING");
		} else {*/
			res.end("CLOSE");
			console.log("CLOSE");
		/*}*/
		step =2;
		
	} else if (step ==2) {
		console.log("Floor: "+floor+" min "+min+" max "+max);
		if (floor >= max && direction == "UP") {
			direction = "DOWN";
		}
		if (floor <= min && direction == "DOWN") {
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