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
    const { id } = req.params; // Obtener el ID del usuario desde la URL
    const { nombre, dominio, subdominio, descripcion, plantilla, hora } = req.body; // Datos a actualizar

    // Buscar el usuario y verificar si tiene un emprendimiento
    const user = await User.findById(id).populate("emprendimiento");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.emprendimiento) {
      return res.status(404).json({ message: "El usuario no tiene un emprendimiento asignado" });
    }

    // Construir el objeto de actualización dinámicamente
    const updateData = { nombre, dominio, subdominio, descripcion, plantilla };
    if (hora) {
      updateData.hora = hora; // Agregar el campo "hora" si está presente en el req.body
    }

    // Actualizar el emprendimiento
    const emprendimiento = await Emprendimiento.findByIdAndUpdate(
      user.emprendimiento._id,
      updateData,
      { new: true } // Devuelve el documento actualizado
    );

    res.json({
      message: "Emprendimiento actualizado con éxito",
      emprendimiento,
    });
  } catch (error) {
    console.log(error)
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





