const mongoose = require("mongoose");



const ReservaSchema = new mongoose.Schema(
    {
        nombreCliente: {
            type: String,
            required: true,
        },
        telefonoCliente: {
            type: String,
            required: true,
        },
        pago: {
            type: String,
            enum: ["efectivo", "mercadopago"],
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
        },
        estado: {
            type: String,
            enum: ["pendiente", "confirmado", "cancelado"],
            default: "pendiente",
        },
    },
    { _id: false } // Si no querés un _id para cada reserva
);

const Reserva = mongoose.model("Reserva", ReservaSchema);
module.exports = Reserva;
