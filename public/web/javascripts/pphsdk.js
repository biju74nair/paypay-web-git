
var scripts = [
'https://code.jquery.com/jquery-1.12.4.js',
'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
'https://pph-paypal-web-pph-paypal-web.a3c1.starter-us-west-1.openshiftapps.com/socket.io/socket.io.js',
'https://pph-paypal-web-pph-paypal-web.a3c1.starter-us-west-1.openshiftapps.com/web/javascripts/socket_io.js'
];

var styles = [
    'https://pph-paypal-web-pph-paypal-web.a3c1.starter-us-west-1.openshiftapps.com/web/css/sdk.css',
    'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'
    ];

(function() {
    loadStyles();
    loadScripts();
})();

    
class PPHSDK {
    init(options){
        this.options = options;
        this.tryConnectingToLocalApp(() => {
            this.initialize();
        });
    }
    initialize(){
        listenForEvents("readyfortransaction", (data) => {
            this.readyfortransaction(data);
        });
        listenForEvents("paid", (data) => {
            this.paid(data);
        });
        listenForEvents("status", (data) => {
            this.status(data);
        });
        listenForEvents("showalert", (data) => {
            this.alert(data);
        });

        listenForEvents("dismissalert", (data) => {
            closealert();
        });

        showConnectDialog();
    }
    tryConnectingToLocalApp(cb){
        var handler = function(success){
            if(success) {
                closeLaunchDialog();
                cb();
            }
            else {
                showLaunchDialog();
                // setTimeout(() => {
                //     connect(handler);
                // },200);
            }
        }
        connect(handler);
    }
    pay(data){
        socket.emit("pay",{
            txtAmount:document.getElementById('amount').value,
            txtGratuity:0,
        });
    }

    readyfortransaction(data){
        if(this.options.readyfortransaction){
            this.options.readyfortransaction(data);
        }
    }

    paid(data){
        if(this.options.paid){
            this.options.paid(data);
        }
    }

    status(data){
        if(this.options.status){
            this.options.status(data);
        }
    }
    alert(data){
        showalert(data);
    }

};

function connectToDevice(){
	var data = {ip:document.getElementById('sdk.ip').value};
	socket.emit("connectToDevice",data);
	console.log("emitted connectToDevice "+data);
}


function getSDKScriptNode(){
    var scripts = document.getElementsByTagName("script");
    for(i=0;i<scripts.length;i++){
        if(scripts[i].getAttribute('src').endsWith('pphsdk.js')){
            return scripts[i];
        }
    }
}
function loadScripts(){
    // var pphsdkscriptnode = getSDKScriptNode();
    var loadedScripts = 0;
    for(index=0;index<scripts.length;index++) {
        var script = document.createElement("SCRIPT");
        script.src = scripts[index];
        script.type = 'text/javascript';
        script.onload = function(){
            loadedScripts++;
            if(loadedScripts == scripts.length){
                triggerReadyEvent();
            }
        }
        // pphsdkscriptnode.parentNode.insertBefore(script,pphsdkscriptnode);
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}

function triggerReadyEvent(){
    setTimeout(() => {
        var event = new CustomEvent('sdkready', {detail:new PPHSDK()});
        window.dispatchEvent(event);    
    },200);
}

function loadStyles(){
    for(index=0;index<styles.length;index++) {
        var style = document.createElement("link");
        style.href = styles[index];
        style.rel = 'stylesheet';
        document.getElementsByTagName("head")[0].appendChild(style);
    }
}
//Alert
var isshowingAlert;
function createAlert(){
    alertdialog = document.createElement("div");
    alertdialog.id = 'sdkalert';
    alertdialog.title = "Messages";
    alertdialog.innerHTML = '';
    document.body.appendChild(alertdialog);
}

function showalert(message){
    if(!isshowingAlert) {
        if(document.getElementById('sdkalert') === null) createAlert();
        dialog = $( "#sdkalert" ).dialog({
            autoOpen: false
        });
        dialog.dialog( "open" );
        isshowingAlert = true;
    } 
    var html = '<p>'+message.title+'</p><br>';
    if(message.message !== null){
        html += message.message;
    }
    console.log('html ='+html);
    $("#sdkalert").html(html);
    
}

function closealert(){
    $("#sdkalert").dialog("close");
    isshowingAlert = false;
}

function autoCloseDialogBox(WaitSeconds) {
    //Auto Close Dialog Box after few seconds
    setTimeout(
        function () {
            $("#sdkalert").dialog("close");
        }, WaitSeconds);
}

//Connect

function createConnectDialog(){
    var connectDialog = document.createElement("div");
    connectDialog.id = 'connect-device-form';
    connectDialog.title = "Connect to WiFi Device";
    connectDialog.innerHTML = ''+
    '<form>'+
      '<fieldset>'+
        '<label for="sdk.ip">IP Address</label>'+
        '<input type="text" name="sdk.ip" id="sdk.ip" value="192.168.1.11" class="text ui-widget-content ui-corner-all">'+
        '<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'+
      '</fieldset>'+
   '</form>';
   document.body.appendChild(connectDialog);
}
function showConnectDialog(){
    createConnectDialog();

    dialog = $( "#connect-device-form" ).dialog({
        autoOpen: false,
        height: 200,
        width: 250,
        modal: true,
        buttons: {
          "Connect": function(){
              connectToDevice();
              dialog.dialog( "close" );
          }
        },
        close: function() {
         
        }
      });

    dialog.dialog( "open" );
}
var showingLaunchDialog;
function createLaunchDialog(){
    sdklaunch = document.createElement("div");
    sdklaunch.id = 'sdklaunch';
    sdklaunch.title = "Alert";
    sdklaunch.innerHTML = "<a href='todo2://launch'>Launch PPH Mediator</a>";
    document.body.appendChild(sdklaunch);
}

function showLaunchDialog(){
    if(showingLaunchDialog) return;
    if(document.getElementById('sdklaunch') === null) createLaunchDialog();
    dialog = $( "#sdklaunch" ).dialog({
        autoOpen: false
    });
    showingLaunchDialog = true;
    dialog.dialog( "open" );
}

function closeLaunchDialog(){
    if(document.getElementById('sdklaunch') !== null) $("#sdklaunch").dialog("close");
    showingLaunchDialog = false;
}

