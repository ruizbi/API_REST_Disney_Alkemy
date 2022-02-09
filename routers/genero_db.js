const express = require('express');
const router = express.Router();
const GeneroSchema = require('../models/Genero');
const {validarCampos, elGeneroExiste} = require('../middlewares/validarCampos');
const { check } = require('express-validator');

// TODO: CREAR GENERO
router.post("/genero", [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("imagen", "El path de la imagen es obligatorio").notEmpty(),
    validarCampos,
    async (req, res) => {
        let {nombre, imagen, peliculas, series} = req.body;
        let validar_genero = await GeneroSchema.findOne({nombre});
        
        if(validar_genero)
            return res.send({message:'El usuario ya existe', data:{}});

        let genero = new GeneroSchema({nombre, imagen, peliculas, series});

        genero
            .save()
            .then((data) => res.send({data, message:'Genero creado'}))
            .catch((error) => res.send({message:'Error al crear genero', data:error}));
}]);

// TODO: OBTENER GENEROS
router.get("/genero", (req, res) => {
    let query = req.query;

    if(Object.keys(query).length === 0) {
        GeneroSchema
            .find()
            .then((data) => res.send({data, message:'Busqueda exitosa'}))
            .catch((error) => res.send({message:'Error en la busqueda', data:error}));
    }
    else if(query.hasOwnProperty('nombre')){
        GeneroSchema
            .find({nombre:query.nombre})
            .then((data) => res.send({data, message:'Busqueda exitosa'}))
            .catch((error) => res.send({message:'Error en la busqueda', data:error}));    
    }
    else if(query.hasOwnProperty('id')){
        GeneroSchema
            .find({_id:query.id})
            .then((data) => res.send({data, message:'Busqueda exitosa'}))
            .catch((error) => res.send({message:'Error en la busqueda', data:error}));    
    }
    else
        res.send({data:{}, message:'Error en el parametro de busqueda'});
});

// TODO: OBTENER GENERO POR ID
router.get("/genero", [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elGeneroExiste),
    validarCampos,
    (req, res) => {
        let {id} = req.query;
        GeneroSchema
            .findById({_id:id})
            .then((data) => (data) ? res.send({message:'Busqueda exitosa',data}):res.send({message:'No se encontro el genero', data:{}}))
            .catch((error) => res.send({message:'Error en la busqueda', data:error}));
}]);

// TODO: BORRAR GENERO POR ID
router.delete("/genero", [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elGeneroExiste),
    validarCampos,
    (req, res) => {
        let {id} = req.query;
        GeneroSchema
            .remove({_id:id})
            .then((data) => res.send({data, message:'Eliminado con exito'}))
            .catch((error) => res.send({message:'Error al eliminar genero', data:error}));
}]);

// TODO: MODIFICAR GENERO POR ID
router.put("/genero", [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(elGeneroExiste),
    validarCampos,
    (req, res) => {
        let {id} = req.query;
        let {_id, ...resto} = req.body;
        GeneroSchema
            .updateOne({_id:id}, {$set:resto})
            .then((data) => res.send({message:'Modificado con exito', data}))
            .catch((error) => res.send({message:'Error al modificar genero', data:error}));
}]);

module.exports = router;