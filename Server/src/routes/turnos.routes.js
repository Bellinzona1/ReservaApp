const express = require("express");
const router = express.Router();
const {
  createTurno,
  getTurnos,
  getTurnoById,
  getTurnosByEmprendimientoId,
  editTurno,
  deleteTurno,
} = require("../controllers/Turno.controller");
const { agregarReserva, getTurnoConReservas } = require("../controllers/Reservas.controller");




// Rutas CRUD para Turnos
router.post("/:emprendimientoId", createTurno); // Crear turno (opcionalmente asociado a un emprendimiento)
router.get("/", getTurnos); // Obtener todos los turnos
router.get("/:id", getTurnoById); // Obtener un turno por ID
router.get("/emprendimiento/:emprendimientoId", getTurnosByEmprendimientoId); // Obtener turnos de un emprendimiento
router.put("/:id", editTurno); // Editar un turno
router.delete("/:id", deleteTurno); // Eliminar un turno

// Rutas para manejar reservas
router.post("/:id/reservas", agregarReserva); 
router.get("/:id/reservas", getTurnoConReservas); 

module.exports = router;
