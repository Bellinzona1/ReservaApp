const mongoose = require("mongoose");

const TurnoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      nombre: {
        type: String,
        required: true,
      },
      imagen: {
        type: String,
        required: true,
      },
      valor: {
        type: Number,
        required: true,
      },
    },
    reservas: [], // array de reservas
  },
  { timestamps: true }
);


const Turno = mongoose.model("Turno", TurnoSchema);

module.exports = Turno;
