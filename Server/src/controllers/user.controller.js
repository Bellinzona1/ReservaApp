const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Excluye la contraseña
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const getUser = async (req, res) => {

  try {
    const user = await User.findById(req.params.id, "-password").populate("emprendimiento");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};


const createUser = async (req, res) => {
    try {
      const { name, email, password, imageProfile, accountStatus } = req.body;
  
      // Verificar si el usuario ya existe
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        imageProfile: imageProfile ,
        accountStatus: accountStatus ,
      });
  
      await newUser.save();
  
      // Generar token JWT
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(201).json({
        message: "Usuario creado con éxito",
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  };


  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Buscar usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
  
      // Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
  
      // Generar token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.json({
        message: "Inicio de sesión exitoso",
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  };
  

  const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, imageProfile, accountStatus } = req.body;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Actualizar los campos si se envían en la request
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (imageProfile !== undefined) user.imageProfile = imageProfile;
      if (accountStatus !== undefined) user.accountStatus = accountStatus;
  
      // Si mandan password nueva, la hasheamos
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
  
      res.json({
        message: "Usuario actualizado con éxito",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          imageProfile: user.imageProfile,
          accountStatus: user.accountStatus,
        },
      });
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };
  

      
        


module.exports = { getUsers, createUser,loginUser,getUser,updateUser };
