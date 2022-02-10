const { request, response } = require("express");
require('dotenv').config();

const validarJWT = (req = request, res = response, next) => {
  const token = req.header('token');
  if(!token){
    return res.send({message:'No hay token'})
  }
  try {
    jwt.verify(token, process.env.KEY_JWT);
    next();
  }catch(error) {
    console.log(error);
    res.send({message:'Error con el token'})
  }
}

  module.exports = validarJWT;