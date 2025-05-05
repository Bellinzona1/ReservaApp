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

      const ingresoPorReserva = 40000;

      let mensual = 0, mensualAnterior = 0;
      let semanal = 0, semanalAnterior = 0;
      let diario = 0, diarioAnterior = 0;
      let total = 0;

      const ventasPorMes = Array(12).fill(0);

      reservas.forEach((reserva) => {
        const fecha = new Date(reserva.fecha);
        const ingreso = ingresoPorReserva;

        total += ingreso;

        if (fecha.getFullYear() === añoActual) {
          ventasPorMes[fecha.getMonth()] += ingreso;
        }

        if (fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual) {
          mensual += ingreso;
        }

        const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
        const añoMesAnterior = mesActual === 0 ? añoActual - 1 : añoActual;

        if (fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoMesAnterior) {
          mensualAnterior += ingreso;
        }

        if (fecha.toDateString() === hoy.toDateString()) {
          diario += ingreso;
        }

        if (fecha.toDateString() === ayer.toDateString()) {
          diarioAnterior += ingreso;
        }

        if (fecha >= primerDiaSemana && fecha <= ultimoDiaSemana) {
          semanal += ingreso;
        }

        if (fecha >= primerDiaSemanaAnterior && fecha <= ultimoDiaSemanaAnterior) {
          semanalAnterior += ingreso;
        }
      });

      const ventas = ventasPorMes.map((ingreso, index) => ({
        mes: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][index],
        ingreso,
        resultado: ingreso
      }));

      const getPorcentajeCambio = (actual, anterior) => {
        if (anterior === 0) return actual > 0 ? 100 : 0;
        return ((actual - anterior) / anterior * 100).toFixed(2);
      };

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
    }

    console.log("Reservas:", reservas);
  }, [reservas]);

  const formatCurrency = (num) => `$${num.toLocaleString('es-AR')}`;

  const getChangeClass = (valor) =>
    valor >= 0 ? "change positive" : "change negative";

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
                <div className={getChangeClass(data.cambio.mensual)}>
                  {data.cambio.mensual >= 0 ? "+" : ""}
                  {data.cambio.mensual}%
                </div>
              </div>
              <div className="card-Recaudacion">
                <div className="title">Balance semanal</div>
                <div className="value">{formatCurrency(data.semanal)}</div>
                <div className={getChangeClass(data.cambio.semanal)}>
                  {data.cambio.semanal >= 0 ? "+" : ""}
                  {data.cambio.semanal}%
                </div>
              </div>
              <div className="card-Recaudacion">
                <div className="title">Balance diario</div>
                <div className="value">{formatCurrency(data.diario)}</div>
                <div className={getChangeClass(data.cambio.diario)}>
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
              <div className="barras-container">
                <div className="barras">
                  {data.ventas.map((item, idx) => (
                    <div key={idx} className="mes">
                      <div
                        className="bar-ingreso"
                        style={{ height: `${item.ingreso / 1000}px` }}
                      ></div>
                      <div
                        className="bar-resultado"
                        style={{ height: `${item.resultado / 1000}px` }}
                      ></div>
                      <span>{item.mes}</span>
                    </div>
                  ))}
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
