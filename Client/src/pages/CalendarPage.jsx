import React, { useEffect, useState } from 'react';
import '../Styles/CalendarPage.css';
import { Navbar } from '../components/Navbar';
import { ClipLoader } from 'react-spinners';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { getTurnoConReservas } from '../service/TurnoService';

export const CalendarPage = ({ user }) => {
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDays, setWeekDays] = useState(Array.from({ length: 7 }, (_, i) => addDays(startDate, i)));
  const hours = Array.from({ length: 10 }, (_, i) => 8 + i);

  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    setWeekDays(Array.from({ length: 7 }, (_, i) => addDays(startDate, i)));
  }, [startDate]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const reservasArray = [];
        for (const id of user?.emprendimiento?.contenido?.turnos || []) {
          const turno = await getTurnoConReservas(id);
          turno.reservas.forEach((reserva) => {
            if (reserva.estado === "Confirmado") {
              reservasArray.push({
                ...reserva,
                titulo: turno.titulo,
              });
            }
          });
          
        }
        setReservas(reservasArray);
        console.log("Reservas cargadas:", reservasArray);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };

    if (user) fetchReservas();
  }, [user]);

  const handlePrevWeek = () => {
    setStartDate((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setStartDate((prev) => addDays(prev, 7));
  };

  const formatDateRange = () => {
    const start = format(startDate, "MMMM d", { locale: es });
    const end = format(addDays(startDate, 6), "d, yyyy", { locale: es });
    return `${start} – ${end}`;
  };

  const normalizarFecha = (fechaStr) => {
    const [fechaBase, horaCompleta] = fechaStr.split('T');
    const [hora, minutos, segundos] = horaCompleta.split(':').map(Number);

    if (hora > 23) {
      const nuevaFecha = new Date(`${fechaBase}T00:00:00`);
      nuevaFecha.setHours(hora, minutos || 0, segundos || 0);
      return nuevaFecha;
    }

    return new Date(fechaStr);
  };

  const getReservasForCell = (day, hour) => {
    return reservas.filter((reserva) => {
      const fechaReserva = normalizarFecha(reserva.fecha);
      const fechaEsperada = new Date(day);
      fechaEsperada.setHours(hour, 0, 0, 0);

      return (
        fechaReserva.getFullYear() === fechaEsperada.getFullYear() &&
        fechaReserva.getMonth() === fechaEsperada.getMonth() &&
        fechaReserva.getDate() === fechaEsperada.getDate() &&
        fechaReserva.getHours() === fechaEsperada.getHours()
      );
    });
  };

  return (
    <div className="home">
      {user ? (
        <>
          <Navbar user={user} />

          <div className="CalendarContainer">
            <div className="ReservaHowShow">
              <div className="howShows-Container">
                <div className="howShows">Ocupado 🔴 </div>
                <div className="howShows">Libre</div>
              </div>
            </div>

            <div className="calendarSpace">
              {/* Encabezado de calendario */}
              <div className="calendar-toolbar">
                <button className="calendar-btn">Semana</button>
                <div className="calendar-date-nav">
                  <button className="calendar-arrow" onClick={handlePrevWeek}>{'<'}</button>
                  <span className="calendar-date-range">{formatDateRange()}</span>
                  <button className="calendar-arrow" onClick={handleNextWeek}>{'>'}</button>
                </div>
                <button className="calendar-btn calendar-disponibilidad">Editar disponibilidad de turnos</button>
              </div>

              <div className="calendar-wrapper">
                <div className="calendar-table">
                  <div className="calendar-header">
                    <div className="calendar-header-time" />
                    {weekDays.map((day, idx) => (
                      <div className="calendar-header-day" key={idx}>
                        <span className="day-name">
                          {format(day, 'EEEE', { locale: es })}
                        </span>
                        <span className="day-number">{format(day, 'd')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="calendar-body">
                    {hours.map((hour, i) => (
                      <div className="calendar-row" key={i}>
                        <div className="calendar-time">{`${hour}:00`}</div>
                        {weekDays.map((day, j) => {
                          const reservasEnCelda = getReservasForCell(day, hour);
                          return (
                            <div key={j} className="calendar-cell">
                              {reservasEnCelda.map((reserva, index) => (
                                <div key={index} className="reserva-box">
                                  <strong>{reserva.nombreCliente}</strong><br />
                                  📞 {reserva.telefonoCliente}<br />
                                  {reserva.titulo}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="spinner-container">
          <ClipLoader size={50} color="#26D8DA" />
          <p>Cargando usuario...</p>
        </div>
      )}
    </div>
  );
};
