import React, { useEffect, useState } from 'react';
import '../Styles/confirmarTurno.css';
import { AddReserva } from '../service/reservas';
import Swal from "sweetalert2";
import axios from 'axios';

export const ConfirmarTurno = ({ turno, fecha, hora, handleTurnoSeleccionado, emprendimiento }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");

  const convertirHoraA24Formato = (hora12) => {
    if (!hora12) return null;

    const [hora, minuto, periodo] = hora12.split(/[: ]/);
    let h = parseInt(hora, 10);
    const m = minuto || '00';

    if (periodo?.toLowerCase() === 'pm' && h !== 12) h += 12;
    if (periodo?.toLowerCase() === 'am' && h === 12) h = 0;

    return `${h.toString().padStart(2, '0')}:${m.padStart(2, '0')}:00`;
  };

  const handlePaymentSelect = async (method) => {
  
    setSelectedPaymentMethod(method);
  };
  
  

  const handleConfirm = async () => {
    if (!nombreCliente || !telefonoCliente || !selectedPaymentMethod) {
      alert("Por favor completá todos los campos y seleccioná un método de pago.");
      return;
    }

    const horaFormateada = convertirHoraA24Formato(hora);
    if (!horaFormateada) {
      alert("Error: hora inválida");
      return;
    }

    const [year, month, day] = fecha.split("-").map(Number); // ej. "2025-04-10"
    const [hour, minute] = horaFormateada.split(":").map(Number); // ej. "15:00:00"

    // ✅ Creamos la fecha con hora local y la dejamos así (el navegador la convierte a UTC al hacer toISOString)
    const fechaCompleta = new Date(year, month - 1, day, hour, minute);

    if (isNaN(fechaCompleta)) {
      alert("Error: formato de fecha u hora inválido.");
      return;
    }


    


    if (selectedPaymentMethod === 'mercadopago') {

      const reserva = {
        nombreCliente,
        telefonoCliente,
        pago: selectedPaymentMethod,
        fecha: fechaCompleta.toISOString(), 
      };

      try {
        const token = localStorage.getItem("token");
        const valor50 = turno?.descripcion?.valor ? turno.descripcion.valor / 2 : 0;
  
        const response = await axios.post(
          "https://reservaapp-zg71.onrender.com/api/mercadopago/crear-preferencia",
          {
            emprendimiento: emprendimiento,
            price: valor50,
            nombreCancha:  `${turno.titulo} -  ${turno.descripcion.nombre}`,
            reserva: reserva,
            turnoId: turno._id,

          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
  
        const { init_point } = response.data;
  
        // Redirigir a Mercado Pago
        window.open(init_point, "_blank");
      } catch (error) {
        console.error("❌ Error al generar botón de pago:", error.response?.data || error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el link de pago.',
          confirmButtonText: 'Entendido',
        });
      }



    } else if (selectedPaymentMethod === 'efectivo') {

      const reserva = {
        nombreCliente,
        telefonoCliente,
        pago: selectedPaymentMethod,
        fecha: fechaCompleta.toISOString(), 
        estado: "Confirmado",
      };


   

    try {
      await AddReserva(turno._id, reserva);
      Swal.fire("¡Éxito!", "Turno creado correctamente", "success");
      window.location.reload(); 
      handleTurnoSeleccionado(null);
    } catch (error) {
      console.error(error);
      alert("Error al confirmar la reserva: " + error);
    }












    }

    
  };

  useEffect(() => {
    console.log("Turno seleccionado:", turno);
  }, []);


  const valor50 = turno?.descripcion?.valor ? turno.descripcion.valor / 2 : 0;


  return (
    <div className="confirmacion-container">
      <h2>Ingrese sus datos para abonar</h2>

      <div className="form-fields">
        <input
          type="text"
          placeholder="Nombre"
          className="input-field"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número de teléfono"
          className="input-field"
          value={telefonoCliente}
          onChange={(e) => setTelefonoCliente(e.target.value)}
        />
      </div>

      <div className="payment-buttons">
        <button
          onClick={() => handlePaymentSelect('efectivo')}
          className={`payment-button ${selectedPaymentMethod === 'efectivo' ? 'selected' : ''}`}
        >
          Pagar en efectivo
        </button>
        <button
          onClick={() => handlePaymentSelect('mercadopago')}
          className={`payment-button ${selectedPaymentMethod === 'mercadopago' ? 'selected' : ''}`}
        >
          Pagar con Mercado Pago
        </button>
      </div>

      <div className="turno-contenidoTurno-container">
        <img src={turno.descripcion.imagen} alt="Imagen del turno" />

        <div className="infoTurno-container">
          <h3>{turno.descripcion.nombre}</h3>
          <p>Valor: ${turno.descripcion.valor}</p>
          <p>- 50%, el restante se paga en la cancha</p>
          <h2>Valor total: ${turno.descripcion.valor}</h2>
        </div>
      </div>

      <div className="total-container">
        <span>Total a abonar: ${valor50}</span>
      </div>

      <button className="confirm-btn" onClick={handleConfirm}>
        Confirmar pago
      </button>
    </div>
  );
};
