const User = require("../models/user.model");
const axios = require("axios");
const Reserva = require("../models/Reserva.model"); // Respeta la R mayúscula




const conectarMercadoPago = async (req, res) => {
  const { code, code_verifier, userId_body } = req.body;


  console.log("code", code);

  if (!code || !code_verifier) {
    return res.status(400).json({ message: "Faltan parámetros" });
  }

  try {
    const response = await axios.post("https://api.mercadopago.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: "4385724245174951",
      client_secret: "cDZnord5P8C7CVopIqJXnt28j96LXgVO", // Añade esta línea
      code,
      code_verifier,
      redirect_uri: "https://genuine-elf-ca9b01.netlify.app/conectmp"
    });

    const { access_token, user_id } = response.data;

    const user = await User.findByIdAndUpdate(
      userId_body,
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


const crearPreference = async (req, res) => {
  const { emprendimiento, price, nombreCancha, reserva } = req.body;

  try {
    const user = await User.findOne({ emprendimiento: emprendimiento._id });

    if (!user || !user.mercadoPagoToken) {
      return res.status(400).json({ message: "El emprendimiento no está vinculado a una cuenta de Mercado Pago" });
    }

    // 1. Guardar la reserva con estado "pendiente de pago"
    const nuevaReserva = new Reserva({
      ...reserva,
      estado: "pendiente de pago",
      medio: "mercadopago"
    });
    await nuevaReserva.save();

    // 2. Crear la preferencia con external_reference = ID de la reserva
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      {
        items: [
          {
            title: `Reserva en ${emprendimiento.nombre} - ${nombreCancha}`,
            description: `${nombreCancha}`,
            quantity: 1,
            currency_id: "ARS",
            unit_price: price
          }
        ],
        back_urls: {
          success: "https://genuine-elf-ca9b01.netlify.app/exito",
          failure: "https://genuine-elf-ca9b01.netlify.app/fallo",
          pending: "https://genuine-elf-ca9b01.netlify.app/pendiente"
        },
        auto_return: "approved",
        notification_url: "https://reservaapp-zg71.onrender.com/api/mercadopago/webhook",
        external_reference: nuevaReserva._id.toString()
      },
      {
        headers: {
          Authorization: `Bearer ${user.mercadoPagoToken}`
        }
      }
    );

    res.json({ init_point: response.data.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error.response?.data || error.message);
    res.status(500).json({ message: "No se pudo generar el link de pago", detalle: error.response?.data });
  }
};



const webhookMP = async (req, res) => {
  try {
    const paymentId = req.query["data.id"];
    const topic = req.query["type"];

    console.log("⚡ Webhook recibido:", { paymentId, topic });

    if (topic === "payment") {
      // 🔎 Obtener los detalles del pago desde Mercado Pago
      const paymentResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` // Este es tu token personal de MP
        }
      });

      const payment = paymentResponse.data;

      console.log("🔍 Datos del pago:", {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference
      });

      // ✅ Buscar la reserva con el external_reference
      const reserva = await Reserva.findById(payment.external_reference);

      if (reserva) {
        reserva.estado = payment.status === "approved" ? "pagado" : "pendiente";
        reserva.metodoPagoId = payment.id;
        reserva.mercadoPagoStatus = payment.status;
        reserva.payerEmail = payment.payer?.email || null;

        await reserva.save();

        console.log("✅ Reserva actualizada:", reserva._id);
      } else {
        console.warn("❗ No se encontró la reserva con ese external_reference:", payment.external_reference);
      }
    }

    res.status(200).send("Webhook recibido");
  } catch (error) {
    console.error("❌ Error en webhook:", error.response?.data || error.message);
    res.sendStatus(500);
  }
};



module.exports = {
  conectarMercadoPago,
  crearPreference,
  webhookMP
};
