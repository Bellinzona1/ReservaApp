import React from 'react';
import '../Styles/plantillaUno.css';

export const PlantillaUno = ({ emprendimiento }) => {
  return (
    <div className="container">
      <div className="card">

        {/* Imagen de perfil */}
        <div className="profile-img">
          <img
            src={emprendimiento.imagen}
            alt="Zona Sport"
          />
        </div>

        {/* Nombre y horario */}
        <h2 className="title">{emprendimiento.nombre}</h2>
        <p className="subtitle">{emprendimiento.descripcion}</p>

        {/* Botones */}
        <button className="btn">Servicios</button>
        <button className="btn">Agendar turno</button>

        {/* Imagen destacada */}
        <div className="main-img">
          <img
            src="https://s3-alpha-sig.figma.com/img/27e1/835f/db852fa73a25dfdf831eecaefd7a37e3?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PiXkjg8W40lDVC2CVbC~TmTth9-8rcqpPbOX5X4LZ2P8WZmnZKCQuqgd362kHz2LjUktPa8l33~S3P5Ma3kW5IlUGkdzMtU28uEejx-vhGXqPb3JvRxzHvtNppZKLjS95Im0oH8DL1IsfSoMgeFbs4ZqmfhVG3nxmluF8yDfhbb~Gq0Ikxk2sx6GCwkeJmCpaAgt5A-cuzH6llCnptrYltmooDy-4fbhePyK5rueq-etCuYzQJKlL4EikQmQ1qmzl6KdhE3HPDvOUWgZQnc4Ay-idoadCBOecYughQve~fqMCxQ4LBaScWDmelTXsVTI8rsRKcKb4YVqB7mDFigR4A__"
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
    </div>
  );
};
