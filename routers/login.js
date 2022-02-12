const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const UsuarioSchema = require('../models/Usuario');
const generarJWT = require('../helpers/generarJWT');
const {validarCampos} = require('../middlewares/validarCampos');
const { check } = require('express-validator');
require('dotenv').config();

router.post('/login', async (req, res) => {
    let {correo, contraseña} = req.body;
    let usuario = await UsuarioSchema.findOne({correo});

    if(!usuario)
        return res.send({message:'El usuario no existe o la contraseña es incorrecta', data:{}});
    if(!usuario.activo)
        return res.send({message:'El usuario no se encuentra activo', data:{}});

    const validar_password = bcryptjs.compareSync(contraseña, usuario.contraseña);
    
    if(!validar_password)
        return res.send({message:'El usuario no existe o la contraseña es incorrecta (PASS)', data:{}});

    const token = await generarJWT(usuario._id);
    res.send({message:'Loggin correcto', usuario, token});

/*    UsuarioSchema
        .findOne({correo, contraseña})
        .then( async (data) => {
            if(data) {
                const token = await generarJWT(data._id);
                res.send({message:'Loggin correcto', data, token})
            }
            else
                res.send({message:'El usuario no existe o la contraseña es incorrecta', data:{}})
        })
        .catch(error => res.send({message:'Error al logear', data:error})); */
});

router.post('/register', [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("correo", "El correo es obligatorio").notEmpty().isEmail(),
    check("contraseña", "La contraseña es obligatoria (Mayor a 6 caracteres)").notEmpty().isLength({min:6}),
    validarCampos,
    async (req, res) => {
        let {correo, contraseña, nombre} = req.body;
        let validar_correo = await UsuarioSchema.findOne({correo});

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

router.delete('/delete/user', [
    check("contraseña", "La contraseña es obligatori").notEmpty(),
    check("correo", "El correo es obligatorio").notEmpty().isEmail(),
    validarCampos,
    async (req, res) => {
        let {correo, contraseña} = req.body;
        let validar_correo = await UsuarioSchema.findOne({correo, contraseña});
        
        if(!validar_correo)
            return res.send({message:'El mail no existe'});
        
        UsuarioSchema
            .updateOne({correo}, {$set:{activo:false}})
            .then((data) => res.send({message:'Modificado con exito', data}))
            .catch((error) => res.send({message:'Error al modificar usuario', data:error}));
    }
]);

module.exports = router;