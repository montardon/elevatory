module.exports = {
ElevatorState : function () {
	this.doorsOpened = false;
	this.currentFloor = 0;

	this.calls = new Array();

	this.users = new Array();

	this.countNothing = 0;

	this.addCall = function(call) {
		this.calls.push(call);
	}

	this.userEntered = function() {
		var i = 0;
		
		console.log(">>> calls ");
		console.log(this.calls);
		for (var i=0;i<this.calls.length;i++) {
			var call = this.calls[i];
			console.log("call ----------------");
			console.log(call);
			console.log(this.currentFloor);
			
			if (call.callFloor == this.currentFloor) {
				this.calls.splice(i,1);
				console.log("calls splice");
				return;
			}
			
		}
		
	}
	
	this.userExited=function() {
		var i = 0;
		
		for (var i=0;i<this.users.length;i++) {
			var user = this.users[i];
			console.log("users " + this.users);
			console.log(user.floor + "==" + this.currentFloor);
			if (user.floor == this.currentFloor) {
				this.users.splice(i,1);
				console.log("users " + this.users);
				return;
			}
			
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
		console.log("DOWN to" + this.currentFloor);
		return "DOWN";
	}
	
	this.open = function() {
		this.doorsOpened = true;
		console.log("OPEN METHOD");
		return "OPEN";
	}
	
	this.close = function() {
		this.doorsOpened = false;
		console.log("CLOSE METHOD");
		return "CLOSE";
	}
	
	this.nextCommandCalls = function() {
		for (var i=0;i<this.calls.length;i++) {
			var call = this.calls[i];
			console.log("#" + call + "==" + this.currentFloor);
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
		for (var i=0;i<this.users.length;i++) {
			var user = this.users[i];
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
		if (this.countNothing <= 0) {
			for (var i=0;i<this.calls.length;i++) {
				var call = this.calls[i];
				if (call.callFloor == this.currentFloor) {
					console.log("CLOSE CANCELED : CAUSE CALL " + call.callFloor);
					this.countNothing ++;
					return "NOTHING";
				}
			}
			
			for (var i=0;i<this.users.length;i++) {
				var user = this.users[i];
				if (user.floor == this.currentFloor) {
					console.log("CLOSE CANCELED : CAUSE user " + user.floor);
					this.countNothing ++;
					return "NOTHING";
				}
			}
		}
		
		this.countNothing = 0;
		return this.close();
	}
	
	this.nextCommand = function() {
		command = "NOTHING";
		
		console.log("doorsOpened " + this.doorsOpened);
		if (this.doorsOpened == true) {
			command = this.nextCommandCloseDoor();
		} else if (this.users.length > 0) {
			command = this.nextCommandUser();
		} else if (this.calls.length > 0) {
			command = this.nextCommandCalls();
		}
		
		console.log("=>" + command + "<=");
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