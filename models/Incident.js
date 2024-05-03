const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el esquema para las observaciones
const observacionSchema = new Schema({
    observacion: { type: String, required: true }, 
    username: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

// Definir el esquema para los cambios de Estados
const estadoSchema = new Schema({
  estado: { type: String, required: true }, 
  fecha: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

// Definir el esquema para el incidente
const incidenteSchema = new Schema({
    titulo: { type: String, required: true }, // Título del incidente
    tipoIncidente: { type: String, required: true }, // Tipo de incidente (agua, alumbrado público, etc.)
    codigo: { type: String, unique: true }, // Código único del incidente
    descripcion: { type: String, required: true }, // Descripción del incidente
    estado: { type: String, default: 'Pendiente' }, 
    reclamante: { // Datos del reclamante
      nombreCompleto: { type: String, required: true },
      telefono: { type: String, required: true },
      email: { type: String},
      direccion: { 
        calle: { type: String, required: true },
        calle1: { type: String },
        calle2: { type: String }
      }
    },
    observaciones: [observacionSchema], // Historial de observaciones
    historialEstado: [estadoSchema], //Historial de Cambios de Estados
    date: {
        type: Date,
        default: Date.now
    },
  }, { timestamps: true });

// Definir un middleware para generar el código único antes de guardar el incidente
incidenteSchema.pre('save', async function(next) {
  try {
      const tipoAbreviado = this.tipoIncidente.substring(0, 2).toUpperCase();
      
      // Buscar el último incidente con el mismo tipo de incidente
      const lastIncident = await this.constructor.findOne({ tipoIncidente: this.tipoIncidente }).sort({ codigo: -1 });
      
      // Obtener el último número del código
      let lastNumber = 0;
      if (lastIncident) {
          const lastCode = lastIncident.codigo;
          const lastNumberStr = lastCode.split('-')[1];
          lastNumber = parseInt(lastNumberStr);
      }
      
      // Incrementar el número del código
      const newNumber = lastNumber + 1;
      const paddedNumber = newNumber.toString().padStart(3, '0');
      
      // Generar el nuevo código
      const nuevoCodigo = tipoAbreviado + '-' + paddedNumber;

      this.codigo = nuevoCodigo;
      next();
  } catch (error) {
      next(error);
  }
});


const Incidente = mongoose.model('Incidente', incidenteSchema);

module.exports = Incidente;
