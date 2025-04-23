import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './Styles/AgendarTurnoComponent.css';
import { ConfirmarTurno } from './ConfirmarTurno';

export const AgendarTurnoComponent = ({ turno, handleTurnoSeleccionado, emprendimiento }) => {
  const [startDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    console.log("Turno seleccionado:", turno);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDay(date);
  };

  const convertirHoraA24hs = (hora12) => {
    const [hora, minuto, periodo] = hora12.split(/[: ]/);
    let h = parseInt(hora, 10);
    if (periodo.toLowerCase() === 'pm' && h !== 12) h += 12;
    if (periodo.toLowerCase() === 'am' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minuto}:00`;
  };

  const isTimeSlotReserved = (day, time) => {
    const [hourStr, minuteStr] = convertirHoraA24hs(time).split(':');
    const fechaEsperada = new Date(day);
    fechaEsperada.setHours(parseInt(hourStr), parseInt(minuteStr), 0, 0);
  
    return turno?.reservas?.some((reserva) => {
      if (reserva.estado !== "Confirmado") return false; // ✅ Solo considerar confirmados
      const fechaReserva = new Date(reserva.fecha);
      return (
        fechaReserva.getFullYear() === fechaEsperada.getFullYear() &&
        fechaReserva.getMonth() === fechaEsperada.getMonth() &&
        fechaReserva.getDate() === fechaEsperada.getDate() &&
        fechaReserva.getHours() === fechaEsperada.getHours() &&
        fechaReserva.getMinutes() === fechaEsperada.getMinutes()
      );
    });
  };
  

  const handleAgendarTurno = (time) => {
    if (!selectedDay) {
      alert("Por favor, selecciona una fecha antes de agendar el turno.");
      return;
    }

    if (selectedDay && time) {
      setSelectedTime(time);
      setShowConfirmation(true);
    }
  };

  const daysOfWeek = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));

  // ✅ Horarios corregidos en formato 12hs real
  const timeSlots = [
    "08:00 am",
    "09:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "01:00 pm",
    "02:00 pm",
    "03:00 pm"
  ];

  if (showConfirmation) {
    return (
      <ConfirmarTurno
        turno={turno}
        fecha={format(selectedDay, 'yyyy-MM-dd')}
        hora={convertirHoraA24hs(selectedTime)}
        handleTurnoSeleccionado={handleTurnoSeleccionado}
        emprendimiento={emprendimiento}
      />
    );
  }

  return (
    <div className="schedule-container">
      <button className="back-button-agendarComponent" onClick={() => handleTurnoSeleccionado()}>
        Volver atrás
      </button>

      <div className="dates-container">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`date-button ${selectedDay && selectedDay.toDateString() === day.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDateChange(day)}
          >
            {format(day, 'iii dd', { locale: es })}
          </button>
        ))}
      </div>

      <div className="time-slots-container">
        {timeSlots.map((time) => {
          const reservado = selectedDay && isTimeSlotReserved(selectedDay, time);
          return (
            <div key={time} className="time-slot">
              <span>{time}</span>
              {reservado ? (
                <span className="reservado-label">Reservado</span>
              ) : (
                <button
                  className="schedule-button"
                  onClick={() => handleAgendarTurno(time)}
                >
                  <span className="icon">📅</span>
                  Agendar turno
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
