const Turno = require("../models/Turno.model");
const Emprendimiento = require("../models/emprendimiento.model");

// 📌 Crear un nuevo turno y asignarlo a un emprendimiento
const createTurno = async (req, res) => {
  try {
    const { emprendimientoId } = req.params; // ID del emprendimiento (opcional)
    const { titulo, nombre, imagen, valor } = req.body;

    // Validación de datos
    if (!titulo || !nombre || !imagen) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Crear el nuevo turno
    const nuevoTurno = new Turno({
      titulo,
      descripcion: { nombre, imagen, valor },
    });

    // Guardar el turno en la base de datos
    await nuevoTurno.save();

    // Si se proporciona un `emprendimientoId`, asociar el turno al emprendimiento
    if (emprendimientoId) {
      const emprendimiento = await Emprendimiento.findById(emprendimientoId);
      if (!emprendimiento) {
        return res.status(404).json({ message: "Emprendimiento no encontrado." });
      }

      emprendimiento.contenido.turnos.push(nuevoTurno._id);
      await emprendimiento.save();
    }

    res.status(201).json({
      message: "Turno creado exitosamente.",
      turno: nuevoTurno,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el turno.", error });
  }
};

// 📌 Obtener todos los turnos
const getTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los turnos.", error });
  }
};

// 📌 Obtener un turno por ID
const getTurnoById = async (req, res) => {
  try {
    const { id } = req.params;
    const turno = await Turno.findById(id);

    if (!turno) {
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    res.json(turno);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el turno.", error });
  }
};

// 📌 Obtener todos los turnos de un emprendimiento
const getTurnosByEmprendimientoId = async (req, res) => {
  try {
    const { emprendimientoId } = req.params;
    const emprendimiento = await Emprendimiento.findById(emprendimientoId).populate("contenido.turnos");

    if (!emprendimiento) {
      return res.status(404).json({ message: "Emprendimiento no encontrado." });
    }

    res.json(emprendimiento.contenido.turnos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los turnos del emprendimiento.", error });
  }
};

// 📌 Editar un turno
const editTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, nombre, imagen, valor } = req.body;

    // Crear el objeto de actualización
    const actualizacion = { titulo };

    if (nombre || imagen || valor) {
      actualizacion.descripcion = {};

      if (nombre) actualizacion.descripcion.nombre = nombre;
      if (imagen) actualizacion.descripcion.imagen = imagen;
      if (valor) actualizacion.descripcion.valor = valor;
    }

    // Actualizar el turno
    const turnoActualizado = await Turno.findByIdAndUpdate(
      id,
      { $set: actualizacion },
      { new: true }
    );

    if (!turnoActualizado) {
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    res.json({
      message: "Turno actualizado con éxito.",
      turno: turnoActualizado,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el turno.", error });
  }
};



// 📌 Eliminar un turno
const deleteTurno = async (req, res) => {
  try {
    const { id } = req.params;

    const turnoEliminado = await Turno.findByIdAndDelete(id);

    if (!turnoEliminado) {
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    // ⚠️ Ajustá este modelo y campo a lo que uses realmente
    await Emprendimiento.updateMany(
      { "contenido.turnos": id },
      { $pull: { "contenido.turnos": id } }
    );

    res.json({ message: "Turno eliminado con éxito." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el turno.", error });
  }
};


module.exports = {
  createTurno,
  getTurnos,
  getTurnoById,
  getTurnosByEmprendimientoId,
  editTurno,
  deleteTurno,
};
