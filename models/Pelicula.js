const mongoose = require('mongoose');

const peliculaSchema = mongoose.Schema({
    titulo: {
        type: String,
        require: true
    },
    imagen: {
        type: String,
        require: true
    },
    fecha_creacion: {
        type: String,
        require: true
    },
    calificacion: {
        type: Number,
        require: true
    },
    personajes: {
        type: [String],
        require: true,
        default: []
    }
});

module.exports = mongoose.model("Pelicula", peliculaSchema);