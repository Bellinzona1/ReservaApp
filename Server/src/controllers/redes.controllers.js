const Emprendimiento = require("../models/emprendimiento.model");


const AddRed = async (req, res) => {
    try {
      const { emprendimientoId } = req.params; // ID del emprendimiento
      const { red } = req.body;

      // Validación de datos
      if (!red || !red.nombre || !red.url) {
        return res.status(400).json({ message: "Todos los campos son obligatorios (nombre y url)." });
      }

      if (emprendimientoId) {
        const emprendimiento = await Emprendimiento.findById(emprendimientoId);
        if (!emprendimiento) {
          return res.status(404).json({ message: "Emprendimiento no encontrado." });
        }

        // Si `redesSociales` no existe, la inicializamos como un array vacío
        if (!Array.isArray(emprendimiento.contenido.redesSociales)) {
          emprendimiento.contenido.redesSociales = [];
        }

        // Agregar la red social al array
        emprendimiento.contenido.redesSociales.push({
          nombre: red.nombre,
          url: red.url
        });

        await emprendimiento.save();
      }
  
      res.status(201).json({
        message: "Red social añadida exitosamente."
      });
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Error al añadir la red social.", error });
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
    AddRed,
    DeleteService
};


