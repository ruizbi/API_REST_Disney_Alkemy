const mongoose = require('mongoose');

const generoSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        require: true
    },
    peliculas: {
        type: [String],
        require: true,
        default: []
    },
    series: {
        type: [String],
        require: true,
        default: []
    }
});

module.exports = mongoose.model("Genero", generoSchema);