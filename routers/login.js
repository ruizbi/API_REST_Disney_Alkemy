const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const UsuarioSchema = require('../models/Usuario');
const generarJWT = require('../helpers/generarJWT');
const validarCampos = require('../middlewares/validarCampos');
const { check } = require('express-validator');
require('dotenv').config();

router.get('/login', (req, res) => {
    let {correo, contraseña} = req.body;
    let validar_correo = UsuarioSchema.findOne({correo});

    if(!validar_correo)
        return res.send({message:'El usuario no existe o la contraseña es incorrecta', data:{}});
    
    UsuarioSchema
        .findOne({correo, contraseña})
        .then( async (data) => {
            if(data) {
                const token = await generarJWT(data._id);
                res.send({message:'Loggin correcto', data, token})
            }
            else
                res.send({message:'El usuario no existe o la contraseña es incorrecta', data:{}})
        })
        .catch(error => res.send({message:'Error al logear', data:error}));
});

router.post('/register', [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("correo", "El correo es obligatorio").notEmpty().isEmail(),
    check("contraseña", "La contraseña es obligatoria (Mayor a 6 caracteres alfanumericos)").notEmpty().isLength({min:6}).isAlphanumeric(),
    validarCampos,
    (req, res) => {
        let {correo, contraseña, nombre} = req.body;
        let validar_correo = UsuarioSchema.findOne({correo});

        if(validar_correo)
            return res.send({message:'El mail ya esta registrado', data:{}});
        
        let usuario = new UsuarioSchema({correo, contraseña, nombre});
        let salt = bcryptjs.genSaltSync();
        usuario.contraseña = bcryptjs.hashSync(contraseña, salt);
        usuario
            .save()
            .then((data) => res.send({data, message:'Usuario creado'}))
            .catch((error) => res.send({data:error, message:'Error al crear usuario'}));
}]);

module.exports = router;