window.onload = function(){

	// $("a[href*='todo2://']").click(function(e)
	// {
	// 	function reqListener () {
	// 		console.log(this.responseText);
	// 	  }
		  
	// 	  var oReq = new XMLHttpRequest();
	// 	  oReq.addEventListener("load", reqListener);
	// 	  oReq.open("GET", e.target.href);
	// 	  oReq.send();
	
	  
	// });

	//   var oReq = new XMLHttpRequest();
	//   oReq.addEventListener("load", function(e){
	// 	document.getElementById("device").style.display = '';
	// 	document.getElementById("sale").style.display = 'none';
	// 	document.getElementById("app").style.display = 'none';
	//   });
	//   oReq.addEventListener("error", function(e){
	// 	document.getElementById("device").style.display = 'none';
	// 	document.getElementById("sale").style.display = 'none';
	// 	document.getElementById("app").style.display = '';
	//   });
	//   oReq.open("GET", "http://localhost:5555/test");
	//   oReq.send();

	// check for local server (http://localhost:5555/test)
	// show launch page & download
	// document.getElementById("sale").style.display = 'none';	
	connect(); //socket.io
	listenForEvents("readyfortransaction", enablePayButton);
	listenForEvents("paid", paid);
	listenForEvents("status", status);
};

function connectToDevice(){
	var data = {ip:document.getElementById('ip').value};
	socket.emit("connectToDevice",data);
	console.log("emitted connectToDevice "+data);
}

function enablePayButton(data){
	document.getElementById("device").style.display = 'none';
	document.getElementById("sale").style.display = '';
	document.getElementById("payBtn").disabled = false;
}

function paid(data){
	//document.getElementById("payBtn").disabled = true;
	// status(data);
}

function status(data){
	if (data === null) return;
	var status = document.getElementById("status").innerText;
	status += "\n" + data.msg;
	document.getElementById("status").innerText = status;
}

function pay(){
	socket.emit("pay",{
		txtAmount:document.getElementById('amount').value,
		txtGratuity:0,
	});
}