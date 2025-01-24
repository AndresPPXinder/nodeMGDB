const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const mortyRoutes = require('./routes/mortyRoutes');
const postRoutes = require('./routes/postRoutes');
const path = require('path'); //nuevo

require('./config/db');
require('./config/dbPostgre');

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public'))); //Nuevo

// Configurar middleware 
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

// rutas
app.use('/', userRoutes);

// ruta postgreSQL
app.use('/post', postRoutes);

// ruta Morty
app.use('/morty', mortyRoutes);


// Puerto de la aplicación
app.listen(3000, ()=> {
    console.log('Servidor corriendo en http://localhost:3000');
})