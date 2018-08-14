var express = require("express");
var User = require("./models/user");
var Piece = require("./models/piece");

var passport = require("passport");
var acl = require('express-acl');

var router = express.Router();

acl.config({
    baseUrl:'/',
    defaultRole:'user',
    decodedObjectName: 'user',
    roleSearchPath: 'user.role'
});

router.use(acl.authorize);

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    if(req.isAuthenticated()){
        req.session.role = req.user.role;
    }

    console.log(req.session);
    next();
});

router.use((req, res, next) => {
    res.locals.currentArma = req.arma;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get('/', async (req, res) => {
    const pieces = await Piece.find();
    res.render('index', {
      pieces
    });
  });
/*router.get("/",(req, res, next) => {
    User.find()
    .sort({ createdAt: "descending" })
    .exec((err, users) => {
        if(err){
            return next(err);
        }
        res.render("index",{ users:users });
    });
});*/

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
    var role = req.body.role;

    User.findOne({ username: username}, (err,user) => {
        if(err){
            return next(err);
        }
        if(user){
            req.flash("error", "El nombre de usuario ya ha sido tomado por otro usuario");
            return res.redirect("/signup");
        }
        var newUser = new User({
            username: username,
            password: password,
            role: role
        });
        newUser.save(next);
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

router.get("/users/:username", (req, res, next) => { //:username se envía como parámetro, por eso :
    User.findOne({ username: req.params.username }, (err, user) => {
        if(err){
            return next(err);
        }
        if(!user){
            return next(404);
        }
        res.render("profile", { user: user });
    });
});

router.get("/armas", (req,res) => {
    res.render("armas");
});

router.get("/registrarArmas", (req,res) => {
    res.render("registrarArmas");
});

router.get("/login",(req, res) => {
    res.render("login");
});

router.post("/login",passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout",(req, res) => {
    req.logout();
    res.redirect("/");
})

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated){
        next();
    }else{
        req.flash("info", "Necesitas iniciar sesión para poder ver esta sección");
        res.redirect("/login");
    }
}

router.get("/edit", ensureAuthenticated, (req, res) => {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.save((err) => {
        if(err){
            next(err);
            return;
        }
        req.flash("info", "Perfil autorizado!");
        res.redirect("/edit");
    });
});

router.post('/add', async (req, res, next) => {
    const piece = new Piece(req.body);
    await piece.save();
    res.redirect('/');
  });
  
  router.get('/turn/:id', async (req, res, next) => {
    let { id } = req.params;
    const piece = await Piece.findById(id);
    piece.status = !piece.status;
    await piece.save();
    res.redirect('/');
  });
  
  
  router.get('/edit/:id', async (req, res, next) => {
    const piece = await Piece.findById(req.params.id);
    console.log(piece)
    res.render('edit', { piece });
  });
  
  router.post('/edit/:id', async (req, res, next) => {
    const { id } = req.params;
    await Piece.update({_id: id}, req.body);
    res.redirect('/');
  });
  
  router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Piece.remove({_id: id});
    res.redirect('/');
  });

module.exports = router;
