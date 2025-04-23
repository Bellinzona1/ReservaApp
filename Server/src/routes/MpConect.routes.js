const express = require("express");
const router = express.Router();

const { conectarMercadoPago, crearPreference, webhookMP } = require("../controllers/MpConect.controller");




router.post("/token", conectarMercadoPago); // Crear turno (opcionalmente asociado a un emprendimiento)
router.post("/crear-preferencia", crearPreference);
router.post("/webhook", webhookMP);






module.exports = router;