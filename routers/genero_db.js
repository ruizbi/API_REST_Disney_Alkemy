const express = require('express');
const router = express.Router();
const generoSchema = require('../models/Genero');

// TODO: CREAR GENERO
router.post("/genero", (req, res) => {
    let genero = generoSchema(req.body);

    genero
        .save()
        .then((data) => res.send({data, message:'Genero creado'}))
        .catch((error) => res.send({message:'Error al crear genero', data:error}));
});

// TODO: OBTENER GENEROS
router.get("/genero", (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        generoSchema
        .find()
        .then((data) => res.send({data, message:'Busqueda exitosa'}))
        .catch((error) => res.send({message:'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('nombre')){
        generoSchema
        .find({nombre:query.nombre})
        .then((data) => res.send({data, message:'Busqueda exitosa'}))
        .catch((error) => res.send({message:'Error en la busqueda', data:error}));    
    }
    else if(query.hasOwnProperty('id')){
        generoSchema
        .find({_id:query.id})
        .then((data) => res.send({data, message:'Busqueda exitosa'}))
        .catch((error) => res.send({message:'Error en la busqueda', data:error}));    
    }
    else
        res.send({data:{}, message:'Error en el parametro de busqueda'});
});

// TODO: OBTENER GENERO POR ID
router.get("/genero", (req, res) => {
    let {id} = req.query;
    generoSchema
        .findById({_id:id})
        .then((data) => (data) ? res.send({message:'Busqueda exitosa',data}):res.send({message:'No se encontro el genero', data:{}}))
        .catch((error) => res.send({message:'Error en la busqueda', data:error}));
});

// TODO: BORRAR GENERO POR ID
router.delete("/genero", (req, res) => {
    let {id} = req.query;
    generoSchema
        .remove({_id:id})
        .then((data) => res.send({data, message:'Eliminado con exito'}))
        .catch((error) => res.send({message:'Error al eliminar genero', data:error}));
});

// TODO: MODIFICAR GENERO POR ID
router.put("/genero", (req, res) => {
    let {id} = req.query;
    let {nombre, imagen, peliculas, series} = req.body;
    generoSchema
        .updateOne({_id:id}, {$set:{nombre, imagen, peliculas, series}})
        .then((data) => res.send({message:'Modificado con exito', data}))
        .catch((error) => res.send({message:'Error al modificar genero', data:error}));
});

module.exports = router;