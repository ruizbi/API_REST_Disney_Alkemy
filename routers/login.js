const express = require('express');
const router = express.Router();
const usuarioSchema = require('../models/Usuario');
const generarJWT = require('../helpers/generarJWT');
require('dotenv').config();

router.get('/login', (req, res) => {
    let user = req.body;
    usuarioSchema
    .findOne({correo:user.correo, contraseña:user.contraseña})
    .then( async (data) => {
        if(data) {
            const token = await generarJWT(data._id);
            res.send({message:'Loggin correcto', data, token})
        }
        else
            res.send({message:'El usuario no existe o la contraseña es incorrecta', data})
    })
    .catch(error => res.send({message:'Error al logear', data:error}));
});

router.post('/register', (req, res) => {
    let {correo, contraseña, nombre} = req.body;
    let usuario = usuarioSchema({correo, contraseña, nombre});
    usuario
    .save()
    .then((data) => res.send({data, message:'Usuario creado'}))
    .catch((error) => res.send({data:error, message:'Error al crear usuario'}));
});

module.exports = router;