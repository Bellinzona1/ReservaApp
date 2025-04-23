import React, { useEffect, useState } from 'react';
import '../Styles/plantillaUnoN.css';
import { PlantillaUnoTurnos } from './ReservaTurnos/PlantillaUnoTurnos';
import ImagenAPlantilla1 from '../../assets/ImagenAPlantilla1.jpeg';

export const PlantillaUno = ({ emprendimiento }) => {
  const [showTurnos, setShowTurnos] = useState(false);
  const [mostrarServicios, setMostrarServicios] = useState(false);

  useEffect(() => {
    console.log("Emprendimiento:", emprendimiento);
  }, []);

  const handleBack = () => {
    setShowTurnos(false);
    setMostrarServicios(false);
  };

  return (
    <div className="container plantillaUno">
      {showTurnos ? (
        <PlantillaUnoTurnos 
          emprendimiento ={emprendimiento}
          emprendimientoHora={emprendimiento.hora} 
          emprendimientoTurnos={emprendimiento.contenido.turnos} 
          volver={handleBack} 
          emprendimientoPlantilla={emprendimiento.plantilla}
        />
      ) : mostrarServicios ? (
        <div className="card">
          <h2 className="title">{emprendimiento.nombre}</h2>
          <p className="subtitle">{emprendimiento.descripcion}</p>

          <div className="servicios-lista">
            <ul>
              {emprendimiento.contenido.servicios.map((servicio, index) => (
                <li key={index}>{servicio}</li>
              ))}
            </ul>
            <button className="btn" onClick={() => setMostrarServicios(false)}>Volver</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="profile-img">
            <img
              src={emprendimiento.imagen}
              alt="Zona Sport"
            />
          </div>

          <h2 className="title">{emprendimiento.nombre}</h2>
          <p className="subtitle">{emprendimiento.descripcion}</p>

          <button className="btn" onClick={() => setMostrarServicios(true)}>Servicios</button>
          <button className="btn" onClick={() => setShowTurnos(true)}>Agendar turno</button>

          <div className="main-img">
            <img
              src={ImagenAPlantilla1}
              alt="Cancha de fútbol"
            />
          </div>

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
