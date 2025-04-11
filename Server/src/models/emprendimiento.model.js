const mongoose = require("mongoose");

const EmprendimientoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    dominio: {
      type: String,
      required: true,
      unique: true, // Cada dominio debe ser único
    },
    descripcion: {
      type: String,
      required: true,
    },
    imagen: {
      type: String,
      default: "https://donpotrero.com/img/posts/2/medidas_sm.jpg",
    },
    plantilla: {
      type: String,
      default: "plantilla 1",
    },
    contenido: {
      turnos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Turno",
        },
      ],
      servicios: [
        {
          type: String,
        },
      ],
      redesSociales: [
        {
          nombre: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
    },
    hora: {
      type: String,
      default: "1",
    },
  },
  { timestamps: true }
);

const Emprendimiento = mongoose.model("Emprendimiento", EmprendimientoSchema);

module.exports = Emprendimiento;
