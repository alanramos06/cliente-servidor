var mongoose = require("mongoose");

var armaSchema = mongoose.Schema({
    descripcion: {type: String, required: true, unique: true},
    fuerza: {type: Number},
    categoria: {type: String, required: true},
    municiones: {type: Boolean},
});

var donothing = () => {

}

armaSchema.methods.desc = function() {
    return this.descripcion;
}

armaSchema.pre("save",function(done){
    var arma = this;
    if(!arma.municiones){
        arma.municiones = false;
        return done();
    }
    if(arma.municiones){
        return done();
    }
});

var Arma = mongoose.model("Arma", armaSchema);
module.exports = Arma;
