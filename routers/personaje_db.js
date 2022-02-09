const express = require('express');
const router = express.Router();
const PersonajeSchema = require('../models/Personaje');
const {validarCampos, elPersonajeExiste} = require('../middlewares/validarCampos');
const { check } = require('express-validator');

// HELPERS

const obtener_info_filtrada = (data = []) => data.map(dato => ({nombre:dato.nombre, imagen:dato.imagen}))

// TODO: CREAR PERSONAJE
router.post("/characters", [
    check('nombre','No se ingreso el nombre').notEmpty(),
    check('edad','No se ingreso la edad').notEmpty(),
    check('peso','No se ingreso el peso').notEmpty(),
    check('historia','No se ingreso la historia').notEmpty(),
    check('imagen','No se ingreso el path de la imagen').notEmpty(),
    validarCampos,
    (req, res) => {
        let {nombre, edad, peso, historia, imagen, series, peliculas} = req.body;
        let validar_personaje = PersonajeSchema.findOne({nombre});

        if(validar_personaje)
            return res.send({message:'El personaje ya existe', data:{}});

        let personaje = new PersonajeSchema({nombre, edad, peso, historia, imagen, series, peliculas});
        personaje
            .save()
            .then(data => res.send({message:'Personaje creado', data}))
            .catch(error => res.send({message:'Error al crear personaje', data:error}));
}]);
 
// TODO: OBTENER PERSONAJES
router.get("/characters", (req, res) => {
    let query = req.query;
    if(Object.keys(query).length === 0){
        PersonajeSchema
            .find()
            .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.send({message: 'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('name')) {
        PersonajeSchema
            .findOne({nombre:query.name})
            .then((data) => {
                (data) ? res.send({data, message:'Busqueda exitosa'}) : res.send({data, message:'No se encontro el personaje'})
            })
            .catch((error) => res.send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('age')) {
        PersonajeSchema
            .find({edad:query.age})
            .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.send({message: 'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('weight')) {   
        PersonajeSchema
            .find({peso:query.weight})
            .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
            .catch((error) => res.send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('movies')) {
        PersonajeSchema
            .find({$or:[{peliculas:{$in:[query.movies]}}, {series:{$in:[query.movies]}}]})
            .then((data) => {
                (data.length > 0) ? res.send({data, message:'Busqueda exitosa'}):res.send({data:[], message:'No hubo resultados'})})
            .catch((error) => res.send({message: 'Error en la busqueda', data:error}));
    }
    else
        res.send({data: {}, message:'Error de parametros'}); 
});

// TODO: BORRAR PERSONAJE
router.delete("/characters", (req, res) => {
    let query = req.query;

    if(query.hasOwnProperty('id')) {
        PersonajeSchema
            .deleteOne({_id:query.id})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.send({message:'Error al borrar', data:error}));
    }
    else if(query.hasOwnProperty('name')) {
        PersonajeSchema
            .deleteOne({nombre:query.name})
            .then((data) => res.send({message:'Eliminado con exito', data}))
            .catch((error) => res.send({message:'Error al borrar', data:error}));
    }
    else res.send({message:'Error en los parametros al borrar', data: {}})
});

// TODO: MODIFICAR PERSONAJE
router.put("/characters", [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elPersonajeExiste),
    validarCampos,
    (req, res) => {
        let {id} = req.query;
        let {nombre, edad, peso, historia, imagen, series, peliculas} = req.body;
        PersonajeSchema
            .updateOne({_id:id}, { $set: {nombre, edad, peso, historia, imagen, series, peliculas}})
            .then((data) => res.send({data, message:'Personaje modificado con exito'}))
            .catch((error) => res.send({message:'Error al modificar el personaje',data:error}));
}]);

module.exports = router;