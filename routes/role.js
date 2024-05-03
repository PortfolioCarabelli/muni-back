// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Ruta para registrar un nuevo rol
router.post('/', roleController.createRole);

// Ruta para obtener todos los roles
router.get('/', roleController.getAllRoles);

module.exports = router;
