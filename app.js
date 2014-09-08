var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var images = [];

app.get('/', function(req, res){
    res.sendFile('index.html', {"root": "./"});
});
app.get('/image', function(req, res){
    var imageIndex = req.query.i;
    if (typeof images[imageIndex] !== 'undefined') {
        res.setHeader("Content-Type", "image/png");
        res.send(images[imageIndex]);
    } else {
       res.send("");
    }
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(8085, function(){
    console.log('listening on *:8085');
});

io.on('connection', function(socket){
    socket.on('save image', function (imageBase64){
        console.log(imageBase64);
        var imageData = new Buffer(imageBase64.substr(imageBase64.indexOf(',') + 1), 'base64');
        images.push(imageData);
        socket.emit("show image", images.length - 1)
    });
});
