import React, { useState } from 'react';
import '../Styles/plantillaDos.css';
import { PlantillaDosTurnos } from './ReservaTurnos/PlantillaDosTurnos';

export const PlantillaDos = ({ emprendimiento }) => {
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [showTurnos, setShowTurnos] = useState(false);

  const handleBack = () => {
    setShowTurnos(false);
    setMostrarServicios(false);
  };

  return (
    <div className="container plantilla2">
      {showTurnos ? (
        <PlantillaDosTurnos
          emprendimientoHora={emprendimiento.hora}
          emprendimientoTurnos={emprendimiento.contenido.turnos}
          emprendimientoPlantilla="2"
          volver={handleBack}
        />
      ) : mostrarServicios ? (
        <div className="card card2">
          <h2 className="title title2">{emprendimiento.nombre}</h2>
          <p className="subtitle subtitle2">{emprendimiento.descripcion}</p>

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
        <div className="card card2">
          {/* Imagen de perfil */}
          <div className="profile-img">
            <img
              src={emprendimiento.imagen}
              alt="Zona Sport"
            />
          </div>

          {/* Nombre y horario */}
          <h2 className="title title2">{emprendimiento.nombre}</h2>
          <p className="subtitle subtitle2">{emprendimiento.descripcion}</p>

          {/* Info y botones */}
          <div className='info-container'>
            <div className='btn-container2'>
              <button className="btn" onClick={() => setMostrarServicios(true)}>Servicios</button>
              <button className="btn" onClick={() => setShowTurnos(true)}>Agendar turno</button>
            </div>

            {/* Redes Sociales */}
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
        </div>
      )}
    </div>
  );
};
