const express = require("express");
const router = express.Router();

const { conectarMercadoPago } = require("../controllers/MpConect.controller");




router.post("/token", conectarMercadoPago); // Crear turno (opcionalmente asociado a un emprendimiento)




module.exports = router;