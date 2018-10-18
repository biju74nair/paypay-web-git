#!/usr/bin/env node
var app = require('./app');
var io = require('socket.io');

app.set('port', process.env.PORT || 5000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

