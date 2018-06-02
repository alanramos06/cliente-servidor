var http = require('http');
var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

var IP_MALVADA = "127.12.25.45";

app.use((request, response, next) => {
    if(request.ip === IP_MALVADA){
        response.status(401).send("Intento de acceso no autorizado");
    }else{
        next();
    }
});

app.set('views', path.resolve(__dirname,'views'));
app.set('view engine','ejs');

app.get('/',(request,response) => response.render('index'));

app.use(express.static(path.resolve(__dirname,"public")));
app.get('/clases',(request,response) => response.render('clases'));
app.get('/armas',(request,response) => response.render('armas'));

app.get('/victimas',function(request,response){
    var ips = ["192.168.0.1"];
    var request_ip = request.connection.remoteAddress;
    if(ips.indexOf(request_ip) >= 0){
        response.status(401).send("Intento de acceso no autorizado");
        console.log(request_ip);
    }else{
        response.render("victimas");
        console.log(request_ip);
    }
});

app.use(function(req,res){
    res.status(404).render("404");
});
app.listen(3000);

//<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
