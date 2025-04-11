import React, { useState } from 'react';
import '../Styles/plantillaCuatro.css';
import { PlantillaUnoTurnos } from './ReservaTurnos/PlantillaUnoTurnos';
import { PlantillaCuatroTurnos } from './ReservaTurnos/PlantillaCuatroTurnos';

export const PlantillaCuatro = ({ emprendimiento }) => {
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [showTurnos, setShowTurnos] = useState(false);

  const handleBack = () => {
    setMostrarServicios(false);
    setShowTurnos(false);
  };

  return (
    <div className="container plantillaCuatro">
      {showTurnos ? (
        <PlantillaCuatroTurnos
          emprendimientoHora={emprendimiento.hora}
          emprendimientoTurnos={emprendimiento.contenido.turnos}
          emprendimientoPlantilla="4"
          volver={handleBack}
        />
      ) : mostrarServicios ? (
        <div className="card card4">
          <h2 className="title title2">{emprendimiento.nombre}</h2>
          <p className="subtitle subtitle4">{emprendimiento.descripcion}</p>

          <div className="servicios-lista">
            <ul>
              {emprendimiento.contenido.servicios.map((servicio, index) => (
                <li key={index}>{servicio}</li>
              ))}
            </ul>
            <button className="btn" onClick={handleBack}>Volver</button>
          </div>
        </div>
      ) : (
        <div className="card card4">
          {/* Imagen de perfil */}
          <div className="profile-img">
            <img
              src={emprendimiento.imagen}
              alt={emprendimiento.nombre}
            />
          </div>

          {/* Nombre y horario */}
          <h2 className="title title2">{emprendimiento.nombre}</h2>
          <p className="subtitle subtitle4">{emprendimiento.descripcion}</p>

          {/* Botones */}
          <div className="btn-container4">
            <button className="btn" onClick={() => setMostrarServicios(true)}>Servicios</button>
            <button className="btn" onClick={() => setShowTurnos(true)}>Agendar turno</button>

            {/* Redes sociales */}
            <div className="redesSociales redessociales2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Podés agregar imagen destacada si lo necesitás */}
          {/* <div className="main-img">...</div> */}
        </div>
      )}
    </div>
  );
};
