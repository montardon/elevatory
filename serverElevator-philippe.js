// Montardon & diodfr
var express= require('express');
var url= require('url');
var querystring = require('querystring');

var app= express();

var floor = 0;
var direction = "UP";
var doorsOpened = false;

var calls = [];
var directions = [];
var gos = [];

var min = 0;
var max = 5;

var updateMinMax = function(userCalls,userGos) {
	var maxCalls = Math.max.apply(Math, userCalls);
	var maxGos = Math.max.apply(Math,userGos);
	max = Math.max(maxCalls,maxGos);
	var minCalls = Math.min.apply(Math, userCalls);
	var minGos = Math.min.apply(Math,userGos);
	min = Math.min(minCalls,minGos);
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
	min = 0;
	max = 5;
	calls = [];
	gos = [];
	doorsOpened = false;
});

var openDoors = function(floor) {
	for(var i = gos.length - 1; i >= 0; i--) {
		if(gos[i] === floor) {
			gos.splice(i, 1);
		}
	}		
	for(var i = calls.length - 1; i >= 0; i--) {
		if(calls[i] === floor) {
			calls.splice(i, 1);
		}
	}	
	doorsOpened = true;
};

var closeDoors = function(res) {
	res.end("CLOSE");
	console.log("CLOSE");
	doorsOpened = false;
};

var doNothing = function(res) {
	res.end("NOTHING");
	console.log("NOTHING");
}

var move = function(afloor,res) {
	console.log("Floor: "+floor+" min "+min+" max "+max);
	if (afloor >= max && direction == "UP") {
		direction = "DOWN";
	}
	if (afloor <= min && direction == "DOWN") {
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
};

app.get('/nextCommand', function(req,res) {
	console.log("nextCommand");	
	res.writeHead(200);

	// Pas d'appels et pas d'utilisateurs, on ne fait rien.
	if (calls === [] && gos === []) {
		doNothing(res);
	}
	// Les portes sont ouvertes, on les ferme sinon on ne peut pas se déplacer
	if (doorsOpened === true) {
		closeDoors(res);
	} else {
		// Les portes sont fermées, on peut éventuellement se déplacer
		// Doit-on ouvrir les portes ?
		if (calls.indexOf(floor) != -1) {
			console.log("Floor found in calls");
			console.log("Calls length="+calls.length);
			if  (calls.length >0 && calls[calls.length-1] === floor) {
				res.end("OPEN");
				console.log("OPEN");
				openDoors(floor);
				updateMinMax(calls,gos);
				return;
			} 	
		} else {
			console.log("Floor not found in calls");
		}
		if (gos.indexOf(floor)!=-1) {
			console.log("Floor found in gos");
			console.log("Gos length="+gos.length);
			res.end("OPEN");
			console.log("OPEN");
			openDoors(floor);
			updateMinMax(calls,gos);
			return;
		}
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

	}	
});
app.listen(80);