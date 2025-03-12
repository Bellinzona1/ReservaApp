import React from 'react'
import '../Styles/plantillaDos.css';

export const PlantillaDos = ({emprendimiento}) => {
  return (
    <div className="container">
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

        {/* Botones */}
        <div className='btn-container2'>


        <button className="btn">Servicios</button>
        <button className="btn">Agendar turno</button>

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


        {/* Imagen destacada */}
       


        



      </div>
    </div>
  )
}
