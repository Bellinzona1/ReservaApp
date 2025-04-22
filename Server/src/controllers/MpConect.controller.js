const User = require("../models/user.model");
const axios = require("axios");



const conectarMercadoPago = async (req, res) => {
    const { code, code_verifier } = req.body;


    console.log("code", code);
  
    if (!code || !code_verifier) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }
  
    try {
      const response = await axios.post("https://api.mercadopago.com/oauth/token", {
        grant_type: "authorization_code",
        client_id: "4385724245174951",
        code,
        code_verifier,
        redirect_uri: "https://genuine-elf-ca9b01.netlify.app/conectmp"
      });
  
      const { access_token, user_id } = response.data;
  
      const user = await User.findByIdAndUpdate(
        req.userId,
        { mercadoPagoToken: access_token, mercadoPagoUserId: user_id },
        { new: true }
      );
  
      res.json({ message: "Vinculación exitosa", user });
      console.log("Usuario actualizado:", user);
    } catch (error) {
      console.log(error);
      console.error("Error:", error.response?.data || error.message);
      res.status(500).json({ message: "Error al conectar con Mercado Pago", detalle: error.response?.data });
    }
  };
  

module.exports = {
  conectarMercadoPago,
};
