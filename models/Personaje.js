const mongoose = require('mongoose');

const personajeSchema = mongoose.Schema({
    nombre: {
        type : String,
        require : true
    },
    edad: {
        type: Number,
        require: true
    },
    peso: {
        type: Number,
        require: true
    },
    historia: {
        type : String,
        require : true
    },
    imagen: {
        type : String,
        require : true
    },
    series: {
        type: [String],
        require: true,
        default: []
    },
    peliculas: {
        type: [String],
        require: true,
        default: []
    }
});

module.exports = mongoose.model("Personaje", personajeSchema);