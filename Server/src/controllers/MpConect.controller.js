const User = require("../models/user.model");
const axios = require("axios");


const conectarMercadoPago = async (req, res) => {
  const { code } = req.body;

  console.log("Código recibido:", code); // Agregado para depuración

  if (!code) {
    return res.status(400).json({ message: "Código de autorización faltante" });
  }

  try {
    const response = await axios.post("https://api.mercadopago.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: "4385724245174951",
      client_secret: 'cDZnord5P8C7CVopIqJXnt28j96LXgVO',
      code,
      redirect_uri: "https://genuine-elf-ca9b01.netlify.app/conectmp"
    });

    const { access_token, user_id } = response.data;

    // Buscar el usuario autenticado y actualizar sus datos de Mercado Pago
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        mercadoPagoToken: access_token,
        mercadoPagoUserId: user_id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Cuenta de Mercado Pago vinculada con éxito", user });
  } catch (error) {
    console.error("Error al conectar con Mercado Pago:", error.response?.data || error.message);
    res.status(500).json({ message: "Error al conectar con Mercado Pago" });
  }
};

module.exports = {
  conectarMercadoPago,
};
