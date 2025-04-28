const Emprendimiento = require("../models/emprendimiento.model");
const User = require("../models/user.model");

// Crear un nuevo emprendimiento y asignarlo a un usuario
const createEmprendimiento = async (req, res) => {
  try {

    const id = req.params.id;
    const { nombre, dominio, descripcion } = req.body;

    // Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario ya tiene un emprendimiento
    if (user.emprendimiento) {
      return res.status(400).json({ message: "El usuario ya tiene un emprendimiento asignado" });
    }

    // Crear el emprendimiento
    const nuevoEmprendimiento = new Emprendimiento({
      nombre,
      dominio,
      descripcion,
    });

    await nuevoEmprendimiento.save();

    // Asignar el emprendimiento al usuario
    user.emprendimiento = nuevoEmprendimiento._id;
    await user.save();

    res.status(201).json({
      message: "Emprendimiento creado y asignado con éxito",
      emprendimiento: nuevoEmprendimiento,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el emprendimiento", error });
  }
};

// Obtener todos los emprendimientos
const getEmprendimientos = async (req, res) => {
  try {
    const emprendimientos = await Emprendimiento.find();
    res.json(emprendimientos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los emprendimientos" });
  }
};


const getEmprendimientoByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario desde la URL


    // Buscar el usuario y traer su emprendimiento relacionado
    const user = await User.findById(id).populate("emprendimiento");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.emprendimiento) {
      return res.status(404).json({ message: "El usuario no tiene un emprendimiento asignado" });
    }

    res.json(user.emprendimiento);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el emprendimiento", error });
  }
};


const editEmprendimientoByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dominio, subdominio, imagen, descripcion, plantilla, hora } = req.body;

    // Buscar el usuario y su emprendimiento
    const user = await User.findById(id).populate("emprendimiento");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.emprendimiento) {
      return res.status(404).json({ message: "El usuario no tiene un emprendimiento asignado" });
    }

    // Traemos el emprendimiento actual
    const emprendimientoActual = user.emprendimiento;

    // Armamos el objeto de actualización usando valores nuevos si existen, sino los viejos
    const updateData = {
      nombre: nombre !== undefined ? nombre : emprendimientoActual.nombre,
      dominio: dominio !== undefined ? dominio : emprendimientoActual.dominio,
      subdominio: subdominio !== undefined ? subdominio : emprendimientoActual.subdominio,
      imagen: imagen !== undefined ? imagen : emprendimientoActual.imagen,
      descripcion: descripcion !== undefined ? descripcion : emprendimientoActual.descripcion,
      plantilla: plantilla !== undefined ? plantilla : emprendimientoActual.plantilla,
      hora: hora !== undefined ? hora : emprendimientoActual.hora,
    };

    // Actualizar el emprendimiento
    const emprendimientoActualizado = await Emprendimiento.findByIdAndUpdate(
      emprendimientoActual._id,
      updateData,
      { new: true } // para que devuelva el actualizado
    );

    res.json({
      message: "Emprendimiento actualizado con éxito",
      emprendimiento: emprendimientoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el emprendimiento", error });
  }
};



const getEmprendimientoByName = async (req, res) => {
  try {
    const { name } = req.params; // Obtener el nombre desde la URL

    // Buscar el emprendimiento ignorando mayúsculas y tildes
    const emprendimiento = await Emprendimiento.findOne({
      dominio: { $regex: new RegExp(`^${name}$`, "i") },
    }).populate({
      path: "contenido.turnos", // Poblar los turnos dentro del emprendimiento
      model: "Turno",
    });

    if (!emprendimiento) {
      return res.status(404).json({ message: "Emprendimiento no encontrado" });
    }

    res.json(emprendimiento);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el emprendimiento", error });
  }
};

module.exports = { createEmprendimiento, getEmprendimientos, getEmprendimientoByUserId, editEmprendimientoByUserId, getEmprendimientoByName };





