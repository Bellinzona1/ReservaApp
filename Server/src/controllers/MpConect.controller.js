const User = require("../models/user.model");
const axios = require("axios");
const Turno = require("../models/Turno.model");




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
  const { emprendimiento, price, nombreCancha, reserva, turnoId } = req.body;

  console.log(turnoId, "turnoId desde crearPreference");

  try {
    const user = await User.findOne({ emprendimiento: emprendimiento._id });

    if (!user || !user.mercadoPagoToken) {
      return res.status(400).json({ message: "El emprendimiento no está vinculado a una cuenta de Mercado Pago" });
    }

    const turno = await Turno.findById(turnoId);
    if (!turno) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    // 🚫 Verificar si ya hay una reserva en esa fecha y hora
    const yaReservado = turno.reservas.some(r =>
      r.estado === "Confirmado" &&
      new Date(r.fecha).toISOString() === new Date(reserva.fecha).toISOString()
    );
    

    console.log("yaReservado", yaReservado);

    if (yaReservado) {
      return res.status(409).json({ message: "Ya existe una reserva para ese horario." });
    }

    // ✅ Agregar la nueva reserva
    const reservaPendiente = {
      ...reserva,
      estado: "pendiente"
    };

    turno.reservas.push(reservaPendiente);
    await turno.save();


    // 2. Crear preferencia con external_reference = `${turnoId}|${fecha}`
    const externalRef = `${turnoId}|${reserva.fecha}`;

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
        external_reference: externalRef
      },
      {
        headers: {
          Authorization: `Bearer APP_USR-4385724245174951-042115-f81d75bc9560784bccac06382710b163-1716243481`
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
      // 1. Obtener los detalles del pago desde Mercado Pago
      const paymentResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer APP_USR-4385724245174951-042115-f81d75bc9560784bccac06382710b163-1716243481`
        }
      });

      const payment = paymentResponse.data;

      const externalRef = payment.external_reference;
      if (!externalRef) {
        console.warn("❗ Pago sin external_reference");
        return res.status(400).send("Falta external_reference");
      }

      const [turnoId, fechaRaw] = externalRef.split("|");
      if (!turnoId || !fechaRaw) {
        console.warn("❗ Formato de external_reference inválido:", externalRef);
        return res.status(400).send("Formato incorrecto de external_reference");
      }

      // 2. Buscar el turno y la reserva embebida
      const turno = await Turno.findById(turnoId);
      if (!turno) {
        console.warn("❗ Turno no encontrado:", turnoId);
        return res.status(404).send("Turno no encontrado");
      }

      // 3. Buscar la reserva exacta por fecha
      const reserva = turno.reservas.find(r => new Date(r.fecha).toISOString() === new Date(fechaRaw).toISOString());

      if (!reserva) {
        console.warn("❗ Reserva no encontrada en el turno:", fechaRaw);
        return res.status(404).send("Reserva no encontrada");
      }

      // 4. Actualizar el estado y guardar
      if (payment.status === "approved") {
        reserva.estado = "pagado";

        await turno.save();

        console.log("✅ Reserva actualizada a 'pagado' en turno", turnoId);
      }
    }

    res.status(200).send("Webhook procesado");
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
