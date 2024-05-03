const express = require('express');
const router = express.Router();
const incidenteController = require('../controllers/IncidentController');

// Ruta para crear un nuevo incidente
router.post('/incidentes', incidenteController.crearIncidente);

// Ruta para obtener todos los incidentes
router.get('/incidentes', incidenteController.getAllIncidentes);

// Ruta para obtener un incidente por su ID
router.get('/incidentes/:id', incidenteController.getIncidenteById);

// Ruta para eliminar un incidente por su ID
router.delete('/incidentes/:id', incidenteController.eliminarIncidente);

// Ruta para actualizar un incidente por su ID
router.put('/incidentes/:id', incidenteController.actualizarIncidente);

// Ruta para agregar una observación a un incidente por su ID
router.post('/incidentes/:id/observaciones', incidenteController.agregarObservacion);

// Ruta para actualizar el estado de un incidente por su ID
router.put('/incidentes/:id/estado', incidenteController.actualizarEstado);

// Ruta para actualizar el estado y agregar una observación a un incidente por su ID
router.put('/incidentes/:id/estado-observacion', incidenteController.actualizarEstadoYAgregarObservacion);

module.exports = router;
