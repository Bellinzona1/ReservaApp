import React, { useEffect, useState } from 'react';
import '../Styles/plantillaTres.css';
import { AgendarTurnoComponent } from '../../AgendarTurnoComponent';

export const PlantillaTresTurnos = ({ emprendimientoTurnos, volver, emprendimientoHora }) => {

  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  const handleTurnoSeleccionado = () => {
    console.log("Limpiando turno seleccionado");
    setTurnoSeleccionado(null);
  }
  
  useEffect(() => {
    console.log("Emprendimiento Turnos:", emprendimientoTurnos);
  }, [emprendimientoTurnos]);



  if (turnoSeleccionado) {
      return (
        <div className="turnos-container-plantillaUno">
        <AgendarTurnoComponent turno={turnoSeleccionado} handleTurnoSeleccionado = {handleTurnoSeleccionado} />
        </div>
      );
    }

  return (
    <div className="turnos-wrapper-plantillaTres">
      <button onClick={volver} className="volverBtnPlantillaTurnos">Volver</button>

      <div className="turnos-scroll-container">
        {emprendimientoTurnos && emprendimientoTurnos.length > 0 ? (
          emprendimientoTurnos.map((turno, index) => (
            <div key={index} className="turno-card-plantillaTres">
              <img src={turno.descripcion.imagen} alt="" className="turno-img" />
              <div className="turno-info">
                <h3>{turno.titulo}</h3>
                <p>{turno.descripcion.nombre}</p>
                <p>1 hora: ${turno.descripcion.valor}</p>
                <button onClick={() => setTurnoSeleccionado(turno)} className='agendar-btn'>Agendar turno</button>
                </div>
            </div>
          ))
        ) : (
          <p>No hay turnos disponibles.</p>
        )}
      </div>
    </div>
  );
};
