function elevatorStat () {
	this.doorsOpened = false;
	this.currentFloor = 0;

	this.calls = [];

	this.usersInElevator = []

	function addCall(call) {
		this.calls.push(call);
	}

	function userEntered() {
		var i = 0;
		
		for(var call in this.calls) {
			if (call.callFloor == this.currentFloor) {
				this.calls.splice(i,1);
				return;
			}
			i++;
		}
		
	}
	
	function userExited() {
		var i = 0;
		
		for(var user in this.users) {
			if (call.floor == this.currentFloor) {
				this.calls.splice(i,1);
				return;
			}
			i++;
		}
		
		
	}
	
	function addUser(user) {
		this.users.push(user);
	}
	
	function up() {
		this.currentFloor++;
	}
	
	function down() {
		this.currentFloor--;
	}
	
	function nextCommand() {
		command = "NOTHING";
		if (this.doorsOpened == true) {
			command = nextCommandCloseDoor();
		} else if (users.lenght > 0) {
			command = nextCommandUser();
		} else if (calls.lenght > 0) {
			command = nextCommandCalls();
		}
		
		return command;
	}
	
	function nextCommandCloseDoor() {
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
		
		return "CLOSE";
	}
}

function call (var floor, var direction) {
	this.callFloor = floor;
	this.callDirection = direction;
}

function user (var destFloor) {
	this.floor = destFloor;
}