const Turno = require("../models/Turno.model"); // Asegurate de que el path sea correcto

// Buscar Turno por ID
const getTurnoConReservas = async (req, res) => {
  try {
    const { id} = req.params;
    const turno = await Turno.findById(id);



    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    res.status(200).json(turno);
  } catch (error) {
    console.error("Error al obtener el turno:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// Agregar una nueva reserva al Turno
const agregarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCliente,telefonoCliente,pago, fecha, estado } = req.body;

    const turno = await Turno.findById(id);

    console.log("Turno encontrado:", id); // Agregado para depuración

    console.log("Turno encontrado:", turno); // Agregado para depuración

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    const nuevaReserva = { nombreCliente,telefonoCliente,pago, fecha, estado };
    turno.reservas.push(nuevaReserva);

    await turno.save();

    res.status(201).json({ mensaje: "Reserva agregada", turno });
  } catch (error) {
    console.error("Error al agregar reserva:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

module.exports = {
  getTurnoConReservas,
  agregarReserva,
};
