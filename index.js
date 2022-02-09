require('dotenv').config();
const express = require('express');
const app = express();
const personajeRoutes = require('./routers/personaje_db');
const peliculaRoutes = require('./routers/pelicula_db');
const serieRoutes = require('./routers/serie_db');
const generoRoutes = require('./routers/genero_db');
const loginRoutes = require('./routers/login');
const validarJWT = require('./helpers/validarJWT');
const dbConnection = require('./database/config');
const puertoEscucha = process.env.PUERTO_ESCUCHA || 9001;

app.use(express.json());
app.use("/api", personajeRoutes);
app.use("/api", peliculaRoutes);
app.use("/api", serieRoutes);
app.use("/api", generoRoutes);
app.use("/auth", loginRoutes);

app.get("/", (req, res) => {
    res.send({message:'Api catalogo entretenimiento'});
});

dbConnection();

app.listen(puertoEscucha, () => console.log(`Servidor escuchando en el puerto ${puertoEscucha}`));