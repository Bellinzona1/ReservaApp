const express = require("express");
const { createEmprendimiento, getEmprendimientos, getEmprendimientoByUserId,editEmprendimientoByUserId,getEmprendimientoByName } = require("../controllers/emprendimiento.controller");

const {AddService, DeleteService} = require("../controllers/Servicios.controller");
const { AddRed } = require("../controllers/redes.controllers");

const router = express.Router();

router.post("/:id", createEmprendimiento); // Crear un emprendimiento
router.get("/:id", getEmprendimientoByUserId); // Crear un emprendimiento
router.get("/getByname/:name", getEmprendimientoByName); // Crear un emprendimiento
router.put("/:id", editEmprendimientoByUserId); // Crear un emprendimiento
router.get("/", getEmprendimientos); // Obtener todos los emprendimientos
router.post("/", createEmprendimiento); // Crear un emprendimiento


router.post("/servicio/:emprendimientoId", AddService); // Añadir un servicio a un emprendimiento
router.delete("/servicio/:emprendimientoId", DeleteService); // Eliminar un servicio de un emprendimiento

router.post("/red/:emprendimientoId", AddRed); // Añadir una red social a un emprendimiento

module.exports = router;
