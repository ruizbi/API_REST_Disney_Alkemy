const express = require('express');
const router = express.Router();
const personajeSchema = require('../models/Personaje');

// HELPERS

const obtener_info_filtrada = (data = []) => data.map(dato => ({nombre:dato.nombre, imagen:dato.imagen}))

// TODO: CREAR PERSONAJE
router.post("/characters", (req, res) => {
    let personaje = personajeSchema(req.body);
    personaje
        .save()
        .then(data => res.send({message:'Personaje creado', data}))
        .catch(error => res.send({message:'Error al crear personaje', data:error}));
});
 
// TODO: OBTENER PERSONAJES
router.get("/characters", (req, res) => {
    let query = req.query;
    if(Object.keys(query).length === 0){
        personajeSchema
        .find()
        .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
        .catch((error) => res.send({message: 'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('name')) {
        personajeSchema
        .findOne({nombre:query.name})
        .then((data) => {
            (data) ? res.send({data, message:'Busqueda exitosa'}) : res.send({data, message:'No se encontro el personaje'})
        })
        .catch((error) => res.send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('age')) {
        personajeSchema
        .find({edad:query.age})
        .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
        .catch((error) => res.send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('weight')) {   
        personajeSchema
        .find({peso:query.weight})
        .then((data) => res.send({data: obtener_info_filtrada(data), message:'Busqueda exitosa'}))
        .catch((error) => res.send({message: 'Error en la busqueda', data:error})); 
    }
    else if(query.hasOwnProperty('movies')) {
        personajeSchema
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
        personajeSchema
        .deleteOne({_id:query.id})
        .then((data) => res.send({message:'Eliminado con exito', data}))
        .catch((error) => res.send({message:'Error al borrar', data:error}));
    }
    else if(query.hasOwnProperty('name')) {
        personajeSchema
        .deleteOne({nombre:query.name})
        .then((data) => res.send({message:'Eliminado con exito', data}))
        .catch((error) => res.send({message:'Error al borrar', data:error}));
    }
    else res.send({message:'Error en los parametros al borrar', data: {}})
});

// TODO: MODIFICAR PERSONAJE
router.put("/characters", (req, res) => {
    let query = req.query;
    let {nombre, edad, peso, historia, imagen, series, peliculas} = req.body;
    personajeSchema
        .updateOne({_id:query.id}, { $set: {nombre, edad, peso, historia, imagen, series, peliculas}})
        .then((data) => res.send({data, message:'Personaje modificado con exito'}))
        .catch((error) => res.send({message:'Error al modificar el personaje',data:error}));
});

module.exports = router;