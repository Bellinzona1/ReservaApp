const Emprendimiento = require("../models/emprendimiento.model");


const AddService = async (req, res) => {
  try {
    const { emprendimientoId } = req.params; // ID del emprendimiento
    const { servicio } = req.body;  // Se espera que 'servicio' sea un array

    // Validación de datos
    if (!servicio || !Array.isArray(servicio)) {
      return res.status(400).json({ message: "Todos los campos son obligatorios y 'servicio' debe ser un array." });
    }

    if (emprendimientoId) {
      const emprendimiento = await Emprendimiento.findById(emprendimientoId);
      if (!emprendimiento) {
        return res.status(404).json({ message: "Emprendimiento no encontrado." });
      }

      // Reemplazar servicios en lugar de agregar
      emprendimiento.contenido.servicios = servicio;
      await emprendimiento.save();
    }

    res.status(201).json({
      message: "Servicio añadido exitosamente."
    });
  } catch (error) {
      console.log(error);
    res.status(500).json({ message: "Error al crear el turno.", error });
  }
};



  const DeleteService = async (req, res) => {
    try {
        const { emprendimientoId } = req.params;
        const { servicio } = req.body;

        // Validación de datos
        if (!servicio) {
            return res.status(400).json({ message: "El nombre del servicio es obligatorio." });
        }

        if (emprendimientoId) {
            const emprendimiento = await Emprendimiento.findById(emprendimientoId);
            if (!emprendimiento) {
                return res.status(404).json({ message: "Emprendimiento no encontrado." });
            }

            const index = emprendimiento.contenido.servicios.indexOf(servicio);

            if (index === -1) {
                return res.status(404).json({ message: "Servicio no encontrado." });
            }

            // Elimina el servicio del array
            emprendimiento.contenido.servicios.splice(index, 1);

            await emprendimiento.save();

            res.status(200).json({
                message: "Servicio eliminado exitosamente."
            });
        } else {
            res.status(400).json({ message: "EmprendimientoId no proporcionado." });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar el servicio.", error });
    }
};

module.exports = {
    AddService,
    DeleteService
};


