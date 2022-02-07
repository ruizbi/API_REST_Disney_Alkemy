const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const puertoEscucha = process.env.PUERTO_ESCUCHA || 9001;
const personajeRoutes = require('./routers/personaje_db');
const peliculaRoutes = require('./routers/pelicula_db');
const serieRoutes = require('./routers/serie_db');
const generoRoutes = require('./routers/genero_db');
const loginRoutes = require('./routers/login');
const validarJWT = require('./helpers/validarJWT');

app.use(express.json());
app.use("/api", personajeRoutes);
app.use("/api", peliculaRoutes);
app.use("/api", serieRoutes);
app.use("/api", generoRoutes);
app.use("/auth", loginRoutes);

app.get("/", (req, res) => {
    res.send({message:'Api catalogo entretenimiento'});
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connect db!'))
  .catch((error) => console.log(error));

app.listen(puertoEscucha, () => console.log(`Servidor escuchando en el puerto ${puertoEscucha}`));