var express = require("express");
var mongoose =  require("mongoose");

var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

var passport = require("passport");

var routes = require("./routes");
var passportsetup = require("./passportsetup");
var app = express();

// connection to db
mongoose.connect('mongodb://localhost/crud-mongo')
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));

passportsetup();

app.set("port",process.env.PORT  || 3000);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine","ejs");

// middlewares
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(session({
    secret: "TKRv0lJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty: "user"
}));
app.use(passport.session());

app.use(routes);

app.listen(app.get("port"),() => {
    console.log("La aplicación inició por el puerto " + app.get("port"));
});
