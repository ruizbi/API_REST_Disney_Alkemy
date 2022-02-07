const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    correo: {
        type: String,
        require: true
    },
    contraseña: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("Usuario", usuarioSchema);