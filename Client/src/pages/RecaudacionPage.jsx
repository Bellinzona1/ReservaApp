import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ClipLoader } from 'react-spinners';
import '../Styles/RecaudacionPage.css';
import { getTurnoConReservas } from '../service/TurnoService';

export const RecaudacionPage = ({ user }) => {
  const [data, setData] = useState({
    mensual: 0,
    semanal: 0,
    diario: 0,
    total: 0,
    cambio: {
      mensual: 0,
      semanal: 0,
      diario: 0,
    },
    ventas: [],
  });

  const [reservas, setReservas] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null); // Estado para el mensaje
  const [message, setMessage] = useState(''); // Estado para el mensaje de la barra seleccionada

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const reservasArray = [];
        for (const id of user?.emprendimiento?.contenido?.turnos || []) {
          const turno = await getTurnoConReservas(id);
          console.log("Turno:", turno);
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
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };

    if (user) fetchReservas();
  }, [user]);

  useEffect(() => {
    if (reservas.length > 0) {
      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const añoActual = hoy.getFullYear();

      // Calcular el balance semanal y diario
      let mensual = 0, semanal = 0, diario = 0, total = 0;
      const ventasPorMes = Array(12).fill(0);

      // Rango de fechas para comparar (día anterior, semana anterior, mes anterior)
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);

      const primerDiaSemana = new Date(hoy);
      primerDiaSemana.setDate(hoy.getDate() - hoy.getDay());
      const ultimoDiaSemana = new Date(hoy);
      ultimoDiaSemana.setDate(hoy.getDate() + (6 - hoy.getDay()));

      const primerDiaSemanaAnterior = new Date(primerDiaSemana);
      primerDiaSemanaAnterior.setDate(primerDiaSemanaAnterior.getDate() - 7);

      const ultimoDiaSemanaAnterior = new Date(ultimoDiaSemana);
      ultimoDiaSemanaAnterior.setDate(ultimoDiaSemanaAnterior.getDate() - 7);

      const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
      const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual;

      let mensualAnterior = 0, semanalAnterior = 0, diarioAnterior = 0;

      reservas.forEach((reserva) => {
        const fecha = new Date(reserva.fecha);
        const ingreso = typeof reserva.price === "number" ? reserva.price : 0;

        if (fecha.getFullYear() === añoActual) {
          ventasPorMes[fecha.getMonth()] += ingreso;
        }

        // Cálculo del Balance Mensual
        if (fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual) {
          mensual += ingreso;
        }
        if (fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoMesAnterior) {
          mensualAnterior += ingreso;
        }

        // Cálculo del Balance Diario
        if (fecha.toDateString() === hoy.toDateString()) {
          diario += ingreso;
        }
        if (fecha.toDateString() === ayer.toDateString()) {
          diarioAnterior += ingreso;
        }

        // Cálculo del Balance Semanal
        if (fecha >= primerDiaSemana && fecha <= ultimoDiaSemana) {
          semanal += ingreso;
        }
        if (fecha >= primerDiaSemanaAnterior && fecha <= ultimoDiaSemanaAnterior) {
          semanalAnterior += ingreso;
        }

        total += ingreso;
      });

      // Calcular el porcentaje de cambio
      const getPorcentajeCambio = (actual, anterior) => {
        if (anterior === 0) return actual > 0 ? 100 : 0;
        return ((actual - anterior) / anterior * 100).toFixed(2);
      };

      const ventas = ventasPorMes.map((ingreso, index) => ({
        mes: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][index],
        ingreso,
        resultado: ingreso,
      }));

      setData({
        mensual,
        semanal,
        diario,
        total,
        cambio: {
          mensual: getPorcentajeCambio(mensual, mensualAnterior),
          semanal: getPorcentajeCambio(semanal, semanalAnterior),
          diario: getPorcentajeCambio(diario, diarioAnterior),
        },
        ventas,
      });

      console.log("Data calculada:", { mensual, semanal, diario, total });
    }
  }, [reservas]);

  const formatCurrency = (num) => {
    if (num == null || isNaN(num)) {
      return "$0"; // Si el valor es inválido o no es un número
    }
    return `$${num.toLocaleString('es-AR')}`;
  };

  const handleBarClick = (mes, ingreso) => {
    setSelectedBar(mes);  // Guardar el mes seleccionado
    setMessage(`El valor de ${mes} es: ${formatCurrency(ingreso)}`); // Establecer el mensaje con el valor
  };

  return (
    <div className="home">
      {user ? (
        <>
          <Navbar user={user} />
          <div className="Recaudacion-Container">
            <div className="dashboard-cards">
              <div className="card-Recaudacion">
                <div className="title">Balance mensual</div>
                <div className="value">{formatCurrency(data.mensual)}</div>
                <div className={`change ${data.cambio.mensual >= 0 ? 'positive' : 'negative'}`}>
                  {data.cambio.mensual >= 0 ? "+" : ""}
                  {data.cambio.mensual}%
                </div>
              </div>
              <div className="card-Recaudacion">
                <div className="title">Balance semanal</div>
                <div className="value">{formatCurrency(data.semanal)}</div>
                <div className={`change ${data.cambio.semanal >= 0 ? 'positive' : 'negative'}`}>
                  {data.cambio.semanal >= 0 ? "+" : ""}
                  {data.cambio.semanal}%
                </div>
              </div>
              <div className="card-Recaudacion">
                <div className="title">Balance diario</div>
                <div className="value">{formatCurrency(data.diario)}</div>
                <div className={`change ${data.cambio.diario >= 0 ? 'positive' : 'negative'}`}>
                  {data.cambio.diario >= 0 ? "+" : ""}
                  {data.cambio.diario}%
                </div>
              </div>
              <div className="card-Recaudacion">
                <div className="title">Total recaudado</div>
                <div className="value">{formatCurrency(data.total)}</div>
              </div>
            </div>

            <div className="ventas-section">
              <div className="ventas-header">
                <h2>Índice de ventas</h2>


                



                <select defaultValue="2025">
                  <option value="2025">2025</option>
                </select>
              </div>

              <div className="signalsContainer">

                  <div className="signalContainer MercadoPagoSignal">

                    <p>Mercado Pago</p>

                    
                    </div>


                    <div className="signalContainer efectivoSignal">

                    <p>Efectivo</p>

                    
                    </div>




                </div>

              <div className="barras-container">
                {/* Líneas de referencia 10K, 20K, 30K, 40K y 50K */}
                <div className="line line-10k"></div>
                <div className="line line-20k"></div>
                <div className="line line-30k"></div>
                <div className="line line-40k"></div>
                <div className="line line-50k"></div>

                {/* Barras de ventas */}
                <div className="barras">
                  {data.ventas.map((item, idx) => (
                    <div
                      key={idx}
                      className="mes"
                      onClick={() => handleBarClick(item.mes, item.ingreso)} // Agregar el evento de clic
                    >
                      <div
                        className="bar-ingreso"
                        style={{ 
                          height: `${item.ingreso / 1000}px`,
                          backgroundColor: "#A3D8F7" // Celeste para efectivo
                        }}
                      ></div>
                      <div
                        className="bar-resultado"
                        style={{ 
                          height: `${item.resultado / 1000}px`,
                          backgroundColor: "#326FFF" // Azul para MercadoPago
                        }}
                      ></div>
                      <span>{item.mes}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mostrar mensaje cuando se haga clic en una barra */}
              {message && (
                <div className="message">
                  <p>{message}</p>
                </div>
              )}
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
