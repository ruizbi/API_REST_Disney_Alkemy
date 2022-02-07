const express = require('express');
const router = express.Router();
const serieSchema = require('../models/Serie');
const generoSchema = require('../models/Genero');

const obtener_info_filtrada = (data = []) => data.map(dato => ({titulo:dato.titulo, imagen:dato.imagen, fecha_creacion:dato.fecha_creacion}))

// TODO: CREAR SERIE
router.post("/serie", (req, res) => {
    let serie = serieSchema(req.body);

    (serie.calificacion < 1) ?
        serie.calificacion = 1 : (serie.calificacion > 5) ?
            serie.calificacion = 5 : null;

        serie
        .save()
        .then((data) => res.send({data, message:'Serie creada'}))
        .catch((error) => res.send({data:error, message:'Error al crear serie'}));
});

// TODO: BUSCAR SERIES
router.get("/serie", (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        serieSchema
        .find()
        .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('name')) {
        serieSchema
        .findOne({titulo:query.name})
        .then((data) => (data) ? res.send({data, message:'Busqueda exitosa'}) : res.send({data:[], message:'No se encontro la serie'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('genre')) {
        generoSchema
        .findOne({nombre:query.genre})
        .then((data) => (Object.keys(data).length > 0) ? res.send({data:data.series, message:'Busqueda exitosa'}):res.send({data:{}, message:'Busqueda exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('order')) {
        (query.order === "ASC") ? 
        serieSchema
        .find()
        .sort({fecha_creacion:1})
        .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda ASC exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'})) :
        serieSchema
        .find().sort({fecha_creacion:-1})
        .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda DESC exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else
        res.send({data:{}, message:'Error en el parametro de busqueda'});
});

// TODO: MODIFICAR SERIE
router.put("/serie", (req, res) => {
    const {id} = req.query;
    const {titulo, imagen, fecha_creacion, calificacion, personajes} = req.body;

    peliculaSchema
        .updateOne({_id:id}, {$set:{titulo, imagen, fecha_creacion, calificacion, personajes}})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.send({message:'Error al modificar serie', data:error}));
});

// TODO: BORRAR SERIE
router.delete("/serie", (req, res) => {
    let query = req.query;
    
    if(query.hasOwnProperty('id')) {
        serieSchema
        .deleteOne({_id:query.id})
        .then((data) => res.send({message:'Eliminado con exito', data}))
        .catch((error) => res.send({message:'Error al borrar', data:error}));
    }
    else if(query.hasOwnProperty('titulo')) {
        serieSchema
        .deleteOne({titulo:query.name})
        .then((data) => res.send({message:'Eliminado con exito', data}))
        .catch((error) => res.send({message:'Error al borrar', data:error}));
    }
});

module.exports = router;