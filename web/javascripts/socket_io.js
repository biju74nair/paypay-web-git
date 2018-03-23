
var socket = null;

function connect(cb){
	if(socket === null) {
		socket = io('http://localhost:5555',{
			autoConnect: false
		});
		socket.on('connect', () => {
			onConnect(cb);
		});
		socket.on('disconnect', function() {
			socket = null;
		});
		socket.on('error', function() {
		});
		socket.on('reconnect_error', function() {
		});
		socket.on('reconnect_failed', function() {
		});
		socket.on('connect_error', function() {
			cb(false);
		});
	} 
	socket.open();
	
}
function onConnect(cb){
	socket.emit("init",{token:'12345678990'});
	cb(true);
	
}
function listenForEvents(interestedEvent, callback) {
	console.log("register for "+interestedEvent);
	socket.on(interestedEvent, function(data) {
		console.log("data came for "+interestedEvent);
		callback(data);
	});	
};