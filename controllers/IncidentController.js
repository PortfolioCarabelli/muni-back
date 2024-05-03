const Incidente = require('../models/incident');

// Controlador para crear un nuevo incidente
const crearIncidente = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { titulo, tipoIncidente, descripcion, reclamante, observacion, username } = req.body;

    // Crear un nuevo incidente con los datos proporcionados
    const nuevoIncidente = new Incidente({
      titulo,
      tipoIncidente,
      descripcion,
      reclamante,
      observaciones: observacion ? [{ observacion, username }] : [] // Inicializar el campo de observaciones
    });

    // Guardar el nuevo incidente en la base de datos
    const incidenteGuardado = await nuevoIncidente.save();

    // Devolver una respuesta con el incidente creado
    res.status(201).json(incidenteGuardado);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al crear el incidente:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al crear el incidente' });
  }
};

// Controlador para obtener todos los incidentes
const getAllIncidentes = async (req, res) => {
  try {
    // Obtener todos los incidentes de la base de datos
    const incidentes = await Incidente.find();
    // Devolver una respuesta con los incidentes encontrados
    res.json(incidentes);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al obtener todos los incidentes:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al obtener todos los incidentes' });
  }
};

// Controlador para obtener un incidente por su ID
const getIncidenteById = async (req, res) => {
  try {
    // Obtener el ID del incidente de los parámetros de la solicitud
    const { id } = req.params;
    // Buscar el incidente por su ID en la base de datos
    const incidente = await Incidente.findById(id);
    // Si el incidente no se encuentra, devolver un error 404
    if (!incidente) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }
    // Devolver una respuesta con el incidente encontrado
    res.json(incidente);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al obtener el incidente por ID:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al obtener el incidente por ID' });
  }
};



// Controlador para eliminar un incidente por su ID
const eliminarIncidente = async (req, res) => {
  try {
    // Obtener el ID del incidente de los parámetros de la solicitud
    const { id } = req.params;
    // Buscar y eliminar el incidente por su ID en la base de datos
    const incidenteEliminado = await Incidente.findByIdAndDelete(id);
    // Si el incidente no se encuentra, devolver un error 404
    if (!incidenteEliminado) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }
    // Devolver una respuesta con el incidente eliminado
    res.json(incidenteEliminado);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al eliminar el incidente:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al eliminar el incidente' });
  }
};

// Controlador para actualizar un incidente por su ID
const actualizarIncidente = async (req, res) => {
  try {
    // Obtener el ID del incidente y los nuevos datos del cuerpo de la solicitud
    const { id } = req.params;
    const { nuevosDatos, observacion, username } = req.body;

    // Buscar el incidente por su ID en la base de datos
    const incidente = await Incidente.findById(id);

    // Si el incidente no se encuentra, devolver un error 404
    if (!incidente) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }

    // Agregar la nueva observación al historial de observaciones del incidente
    incidente.observaciones.push({ observacion, username });

    // Actualizar los datos del incidente, incluyendo la nueva observación
    const incidenteActualizado = await Incidente.findByIdAndUpdate(id, {
      ...nuevosDatos,
      $push: { observaciones: { observacion, username } } // Agregar la nueva observación al historial
    }, { new: true });

    // Si el incidente no se encuentra, devolver un error 404
    if (!incidenteActualizado) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }

    // Devolver una respuesta con el incidente actualizado
    res.json(incidenteActualizado);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al actualizar el incidente y agregar una observación:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al actualizar el incidente y agregar una observación' });
  }
};

// Controlador para agregar una observación a un incidente por su ID
const agregarObservacion = async (req, res) => {
  try {
    // Obtener el ID del incidente y los datos de la observación del cuerpo de la solicitud
    const { id } = req.params;
    const { observacion, username } = req.body;

    // Buscar el incidente por su ID en la base de datos
    const incidente = await Incidente.findById(id);

    // Si el incidente no se encuentra, devolver un error 404
    if (!incidente) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }

    // Agregar la nueva observación al historial de observaciones del incidente
    incidente.observaciones.push({ observacion, username });

    // Guardar el incidente actualizado en la base de datos
    const incidenteActualizado = await Incidente.findByIdAndUpdate(
      id,
      {
        $push: { observaciones: { observacion, username } }
      },
      { new: true }
    );

    if (!incidenteActualizado) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }
    // Devolver una respuesta con el incidente actualizado
    res.json(incidenteActualizado);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al agregar una observación al incidente:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al agregar una observación al incidente' });
  }
};

// Controlador para actualizar el estado de un incidente por su ID
const actualizarEstado = async (req, res) => {
  try {
    // Obtener el ID del incidente y el nuevo estado del cuerpo de la solicitud
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    // Buscar el incidente por su ID en la base de datos
    const incidente = await Incidente.findById(id);

    // Si el incidente no se encuentra, devolver un error 404
    if (!incidente) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }

    // Actualizar el estado del incidente
    incidente.estado = nuevoEstado;

    // Guardar el incidente actualizado en la base de datos
    const incidenteActualizado = await incidente.save();

    // Devolver una respuesta con el incidente actualizado
    res.json(incidenteActualizado);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al actualizar el estado del incidente:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al actualizar el estado del incidente' });
  }
};

// Controlador para actualizar el estado y agregar una observación a un incidente por su ID
// Controlador para actualizar el estado y agregar una observación a un incidente por su ID
const actualizarEstadoYAgregarObservacion = async (req, res) => {
  try {
    // Obtener el ID del incidente, el nuevo estado y los datos de la observación del cuerpo de la solicitud
    const { id } = req.params;
    const { nuevoEstado, observacion, username } = req.body;
    console.log(nuevoEstado)
    console.log(observacion)
    // Utilizar findByIdAndUpdate para actualizar el incidente
    const incidenteActualizado = await Incidente.findByIdAndUpdate(
      id,
      {
        $set: { estado: nuevoEstado },
        $push: { observaciones: { observacion: observacion, username: username } ,
                 historialEstado: { estado: nuevoEstado, username} },
      },
      { new: true }
    );

    // Si el incidente no se encuentra, devolver un error 404
    if (!incidenteActualizado) {
      return res.status(404).json({ mensaje: 'Incidente no encontrado' });
    }

    // Devolver una respuesta con el incidente actualizado
    res.json(incidenteActualizado);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    console.error('Error al actualizar el estado y agregar una observación al incidente:', error);
    res.status(500).json({ mensaje: 'Se produjo un error al actualizar el estado y agregar una observación al incidente' });
  }
};



module.exports = {
  crearIncidente,
  getAllIncidentes,
  getIncidenteById,
  eliminarIncidente,
  actualizarIncidente,
  agregarObservacion,
  actualizarEstado,
  actualizarEstadoYAgregarObservacion
};
