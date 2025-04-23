import React, { useEffect, useState } from 'react';
import '../Styles/plantillaUno.css';
import { AgendarTurnoComponent } from '../../AgendarTurnoComponent';


export const PlantillaUnoTurnos = ({ emprendimientoTurnos, volver,emprendimientoHora, emprendimiento }) => {
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
          <div key={index} className="turno-card-plantillaUno">
            <h3>{turno.titulo}</h3>
            <p>{turno.descripcion.nombre}</p>
            <p>{emprendimientoHora} Hora: ${turno.descripcion.valor}</p>
            <img src={turno.descripcion.imagen} alt="" />

            <button onClick={() => setTurnoSeleccionado(turno)}>Agendar turno</button>
          </div>
        ))
      ) : (
        <p>No hay turnos disponibles.</p>
      )}
    </div>
  );
};