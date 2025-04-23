import React, { useState } from 'react';
import "../Styles/plantillaTres.css";
import { PlantillaTresTurnos } from './ReservaTurnos/PlantillaTresTurnos';
import ImagenAPlantilla3 from '../../assets/ImagenAPlantilla3.jpeg';


export const PlantillaTres = ({ emprendimiento }) => {
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [showTurnos, setShowTurnos] = useState(false);

  const handleBack = () => {
    setMostrarServicios(false);
    setShowTurnos(false);
  };

  return (
    <div className="container plantillaTres">
      {showTurnos ? (
        <PlantillaTresTurnos
        emprendimiento={emprendimiento}
          emprendimientoHora={emprendimiento.hora}
          emprendimientoTurnos={emprendimiento.contenido.turnos}
          emprendimientoPlantilla="3"
          volver={handleBack}
        />
      ) : mostrarServicios ? (
        <div className="card card3">
          <h2 className="title">{emprendimiento.nombre}</h2>
          <p className="subtitle subtitle3">{emprendimiento.descripcion}</p>

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
        <div className="card card3">

          {/* Imagen de perfil */}
          <div className="profile-img">
            <img
              src={emprendimiento.imagen}
              alt={emprendimiento.nombre}
            />
          </div>

          {/* Nombre y horario */}
          <h2 className="title">{emprendimiento.nombre}</h2>
          <p className="subtitle subtitle3">{emprendimiento.descripcion}</p>

          {/* Botones */}
          <button className="btn" onClick={() => setMostrarServicios(true)}>Servicios</button>
          <button className="btn" onClick={() => setShowTurnos(true)}>Agendar turno</button>

          {/* Imagen destacada */}
          <div className="main-img">
            <img
              src={ImagenAPlantilla3}
              alt="Imagen destacada"
            />
          </div>

          {/* Redes Sociales */}
          <div className="redesSociales">
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
      )}
    </div>
  );
};
