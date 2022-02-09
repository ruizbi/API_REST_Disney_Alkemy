const {Schema, model} = require('mongoose');

const generoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    imagen: {
        type: String,
        required: [true, 'El path de la imagen es obligatorio']
    },
    peliculas: {
        type: [String],
        default: []
    },
    series: {
        type: [String],
        default: []
    }
});

module.exports = model("Genero", generoSchema);