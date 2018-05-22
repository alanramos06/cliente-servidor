var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

var publicPath = path.join(__dirname, 'public');
app.use('/recursos', express.static(publicPath));

app.use((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('No se encontró ningún archivo');
});

http.createServer(app).listen(3000);