// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const app = express();


// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// Conexión a MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Definir rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roles',  require('./routes/role'));
app.use('/api/incidentes',  require('./routes/incidenteRoutes'));
// Puerto del servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
