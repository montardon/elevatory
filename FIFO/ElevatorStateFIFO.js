module.exports = {
ElevatorState : function () {
	this.doorsOpened = false;
	this.currentFloor = 0;

	this.calls = new Array();

	this.users = new Array();

	this.addCall = function(call) {
		this.calls.push(call);
	}

	this.userEntered = function() {
		var i = 0;
		
		for(var call in this.calls) {
			if (call.callFloor == this.currentFloor) {
				this.calls.splice(i,1);
				return;
			}
			i++;
		}
		
	}
	
	this.userExited=function() {
		var i = 0;
		
		for(var user in this.users) {
			if (call.floor == this.currentFloor) {
				this.calls.splice(i,1);
				return;
			}
			i++;
		}
		
		
	}
	
	this.addUser = function(user) {
		this.users.push(user);
	}
	
	this.up = function() {
		this.currentFloor++;
		console.log("UP to" + this.currentFloor);
		return "UP";
	}
	
	this.down = function() {
		this.currentFloor--;
		console.log("UP to" + this.currentFloor);
		return "DOWN";
	}
	
	this.open = function() {
		doorOpened = true;
		console.log("OPEN METHOD");
		return "OPEN";
	}
	
	this.close = function() {
		doorOpened = false;
		
		return "CLOSE";
	}
	
	this.nextCommandCalls = function() {
		for(call in this.calls) {
			console.log(call + ' '  + this.currentFloor);
			if (call.callFloor == this.currentFloor) {
				return this.open();
			}
		}
		
		if (this.calls[0].callFloor > this.currentFloor) {
			
			return this.up();
		}
		
		return this.down();
	}
	
	this.nextCommandUser = function() {
		for(user in this.users) {
			if (user.floor == this.currentFloor) {
				return this.open();
			}
		}
		
		if (this.users[0].floor > this.currentFloor) {
			return this.up();
		}
		
		return this.down();
	}
	
	this.nextCommandCloseDoor = function() {
		for(call in this.calls) {
			if (call.callFloor == this.currentFloor) {
				return "NOTHING";
			}
		}
		
		for(user in this.users) {
			if (user.floor == this.currentFloor) {
				return "NOTHING";
			}
		}
		
		return this.close();
	}
	
	this.nextCommand = function() {
		command = "NOTHING";
		if (this.doorsOpened == true) {
			command = this.nextCommandCloseDoor();
		} else if (this.users.length > 0) {
			command = this.nextCommandUser();
		} else if (this.calls.length > 0) {
			command = this.nextCommandCalls();
		}
		
		return command;
	}
}
,
call : function (floor, direction) {
	this.callFloor = floor;
	this.callDirection = direction;
}
,
user : function (destFloor) {
	this.floor = destFloor;
}
};