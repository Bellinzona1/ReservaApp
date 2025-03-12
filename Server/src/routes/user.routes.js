const express = require("express");
const { getUsers, createUser,loginUser,getUser } = require("../controllers/user.controller");
const User = require("../models/user.model");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getUsers);  // Obtener todos los usuarios
router.post("/RegisterUser", createUser); // Crear un nuevo usuario
router.post("/LoginUser", loginUser); // Iniciar sesión
router.get("/profile", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId, "-password");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el perfil" });
    }
  });

router.get("/:id",getUser)


module.exports = router;
