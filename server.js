var express = require('express')
,   app     = express()
,   server  = require('http').createServer(app)
,   io      = require('socket.io').listen(server)
,   conf    = require('./config.json');

server.listen(conf.port);
console.log("server started - listening on port " + conf.port);

/* serve static content from "htdocs" folder */
app.use(express.static(__dirname + '/htdocs'));


// "GET /" serves index.html
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/htdocs/index.html');
});

io.sockets.on('connection', function (socket) {

    // client connected
    socket.emit('control', {
        time: new Date(),
        text: 'Gummynet - yeah!'
    });

    // control message (whatever for...)
    socket.on('control', function (data) {
        // log control message
        console.log(data.text);
    });

    // execute shell command
    socket.on('shell', function (data) {
        console.log(data.command);
        var exec = require('child_process').exec;
        var cmd = data.command;

        exec(cmd, function(error, stdout, stderr) {
            socket.emit('shell', {
                time    : new Date(),
                stdout  : stdout
            });
        });
    });
});
