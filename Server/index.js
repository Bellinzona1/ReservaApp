require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/user.routes");
const EmprendimientoRoutes = require("./src/routes/emprendimiento.routes");
const turnoRoutes = require("./src/routes/turnos.routes");
const MpConectRoutes = require("./src/routes/MpConect.routes");
const axios = require("axios");



const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Conectar a la base de datos
connectDB();

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/emprendimientos",EmprendimientoRoutes);
app.use("/api/turnos", turnoRoutes);
app.use("/api/mercadopago", MpConectRoutes);




// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
