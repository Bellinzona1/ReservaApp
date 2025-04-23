import React, { useEffect, useState } from 'react';
import '../Styles/plantillaCuatro.css';
import { AgendarTurnoComponent } from '../../AgendarTurnoComponent';

export const PlantillaCuatroTurnos = ({ emprendimientoTurnos, volver, emprendimientoHora, emprendimiento }) => {
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
        <AgendarTurnoComponent turno={turnoSeleccionado} handleTurnoSeleccionado = {handleTurnoSeleccionado} emprendimiento={emprendimiento} />
      </div>
    );
  }

  return (
    <div className="turnos-container-plantillaUno">
      <button onClick={volver} className='volverBtnPlantillaTurnos'>Volver</button>

      {emprendimientoTurnos && emprendimientoTurnos.length > 0 ? (
        emprendimientoTurnos.map((turno, index) => (
          <div key={index} className="turno-card-plantillaDos turno-card-plantillaCuatro">
            <img className='imgFondoPlantillaCuatro' src={turno.descripcion.imagen} alt="" />

            <div className="contenidoPlantillaDosContainer contenidoPlantillaCuatroContainer">
              <p>{turno.descripcion.nombre}</p>
              <p>{emprendimientoHora} Hora: ${turno.descripcion.valor}</p>
              <button onClick={() => setTurnoSeleccionado(turno)}>Agendar turno</button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay turnos disponibles.</p>
      )}
    </div>
  );
};
