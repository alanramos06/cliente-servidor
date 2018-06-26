var express = require("express");
var Zombie = require("./models/zombie");
var Arma = require("./models/arma");

var passport = require("passport");

var router = express.Router();

router.use((req, res, next) => {
    res.locals.currentZombie = req.zombie;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.use((req, res, next) => {
    res.locals.currentArma = req.arma;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/",(req, res, next) => {
    Zombie.find()
    .sort({ createdAt: "descending" })
    .exec((err, zombies) => {
        if(err){
            return next(err);
        }
        res.render("index",{ zombies:zombies });
    });
});

router.get("/armas",(req, res, next) => {
    Arma.find()
    .exec((err, armas) => {
        if(err){
            return next(err);
        }
        res.render("armas",{ armas:armas });
    });
});

router.get("/signup", (req,res) => {
    res.render("signup");
});

router.post("/signup", (req,res,next) => {
    var username = req.body.username;
    var password = req.body.password;

    Zombie.findOne({ username: username}, (err,zombie) => {
        if(err){
            return next(err);
        }
        if(zombie){
            req.flash("error", "El nombre de usuario ya ha sido tomado por otro zombie");
            return res.redirect("/signup");
        }
        var newZombie = new Zombie({
            username: username,
            password: password
        });
        newZombie.save(next);
        return res.redirect("/");
    });
});

router.post("/registrarArmas", (req,res,next) => {
    var descripcion = req.body.descripcion;
    var fuerza = req.body.fuerza;
    var categoria = req.body.categoria;
    var municiones = req.body.municiones;

    Arma.findOne({ descripcion: descripcion}, (err,arma) => {
        if(err){
            return next(err);
        }
        if(arma){
            req.flash("error", "Esta arma ya se ha registrado");
            return res.redirect("/registrarArmas");
        }
        var newArma = new Arma({
            descripcion:descripcion,
            fuerza:fuerza,
            categoria:categoria,
            municiones:municiones
        });
        newArma.save(next);
        return res.redirect("/armas");
    });
});

router.get("/zombies/:username", (req, res, next) => { //:username se envía como parámetro, por eso :
    Zombie.findOne({ username: req.params.username }, (err, zombie) => {
        if(err){
            return next(err);
        }
        if(!zombie){
            return next(404);
        }
        res.render("profile", { zombie: zombie });
    });
});

router.get("/armas", (req,res) => {
    res.render("armas");
});

router.get("/registrarArmas", (req,res) => {
    res.render("registrarArmas");
});

router.get("/login",(req,res) => {
    res.render("login");
});

router.post("/login",passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

module.exports = router;
