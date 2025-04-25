const express = require("express");
const router = express.Router();

const { conectarMercadoPago, crearPreference, webhookMP,desconectarMercadoPago } = require("../controllers/MpConect.controller");




router.post("/token", conectarMercadoPago); // Crear turno (opcionalmente asociado a un emprendimiento)
router.post("/desconectar", desconectarMercadoPago); // Desconectar cuenta de Mercado Pago
router.post("/crear-preferencia", crearPreference);
router.post("/webhook", webhookMP);






module.exports = router;