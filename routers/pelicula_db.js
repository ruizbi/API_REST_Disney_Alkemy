const express = require('express');
const router = express.Router();
const peliculaSchema = require('../models/Pelicula');
const generoSchema = require('../models/Genero');

const obtener_info_filtrada = (data = []) => data.map(dato => ({titulo:dato.titulo, imagen:dato.imagen, fecha_creacion:dato.fecha_creacion}))

// TODO: CREAR PELICULA
router.post("/pelicula", (req, res) => {
    let pelicula = peliculaSchema(req.body);

    (pelicula.calificacion < 1) ?
        pelicula.calificacion = 1 : (pelicula.calificacion > 5) ?
            pelicula.calificacion = 5 : null;

    pelicula
        .save()
        .then((data) => res.send({data, message:'Pelicula creada'}))
        .catch((error) => res.send({data:error, message:'Error al crear pelicula'}));
});

// TODO: BUSCAR PELICULAS
router.get("/pelicula", (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        peliculaSchema
        .find()
        .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('name')) {
        peliculaSchema
        .findOne({titulo:query.name})
        .then((data) => (data) ? res.send({data, message:'Busqueda exitosa'}) : res.send({data:{}, message:'No se encontro la pelicula'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('genre')) {
        generoSchema
        .findOne({nombre:query.genre})
        .then((data) => (Object.keys(data).length > 0) ? res.send({data:data.peliculas, message:'Busqueda exitosa'}):res.send({data:{}, message:'Busqueda exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else if(query.hasOwnProperty('order')) {
        (query.order === "ASC") ? 
        peliculaSchema
        .find()
        .sort({fecha_creacion:1})
        .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda ASC exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'})) :
        peliculaSchema
        .find().sort({fecha_creacion:-1})
        .then((data) => res.send({data:obtener_info_filtrada(data), message:'Busqueda DESC exitosa'}))
        .catch((error) => res.send({data:error, message:'Error en la busqueda'}));
    }
    else
        res.send({data:{}, message:'Error en el parametro de busqueda'});
});

// TODO: MODIFICAR PELICULA
router.put("/pelicula", (req, res) => {
    const {id} = req.query;
    const {titulo, imagen, fecha_creacion, calificacion, personajes} = req.body;

    peliculaSchema
        .updateOne({_id:id}, {$set:{titulo, imagen, fecha_creacion, calificacion, personajes}})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.send({message:'Error al modificar pelicula', data:error}));
});

// TODO: BORRAR PELICULA
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