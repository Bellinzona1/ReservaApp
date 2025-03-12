const express = require("express");
const { createEmprendimiento, getEmprendimientos, getEmprendimientoByUserId,editEmprendimientoByUserId,getEmprendimientoByName } = require("../controllers/emprendimiento.controller");

const router = express.Router();

router.post("/:id", createEmprendimiento); // Crear un emprendimiento
router.get("/:id", getEmprendimientoByUserId); // Crear un emprendimiento
router.get("/getByname/:name", getEmprendimientoByName); // Crear un emprendimiento
router.put("/:id", editEmprendimientoByUserId); // Crear un emprendimiento
router.get("/", getEmprendimientos); // Obtener todos los emprendimientos

module.exports = router;
