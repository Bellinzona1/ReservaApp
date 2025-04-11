import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmprendimientoByName } from '../service/emprendimientosService';
import { PlantillaUno } from '../components/plantillas/plantillaUno';
import { ClipLoader } from "react-spinners";
import { PlantillaDos } from '../components/plantillas/PlantillaDos';
import { PlantillaTres } from '../components/plantillas/PlantillaTres';
import { PlantillaCuatro } from '../components/plantillas/PlantillaCuatro';

export const PrincipalPage = ({ emprendimientoPre }) => {
  const { name } = useParams();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Si se proporciona `emprendimientoPre` y no hay `name` en la URL
    if (emprendimientoPre && !name) {
      setLoading(true);
      getEmprendimientoByName(emprendimientoPre.dominio)
        .then((data) => {
          setEmprendimiento(data);
          console.log(data);
          setError(null);
        })
        .catch((error) => {
          console.error("Error en la carga de datos:", error);
          setError("No se pudo cargar el emprendimiento.");
        })
        .finally(() => {
          setLoading(false);
        });

      return; // Termina la ejecución si ya cargó `emprendimientoPre`
    }

    if (!name) return; // Si `name` no está presente, no hace nada

    setLoading(true);
    getEmprendimientoByName(name)
      .then((data) => {
        setEmprendimiento(data);
        console.log(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error en la carga de datos:", error);
        setError("No se pudo cargar el emprendimiento.");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [name, emprendimientoPre]); // 🔥 Agregué `emprendimientoPre` como dependencia para actualizar correctamente

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color="#26D8DA" />
          <p>Cargando Emprendimiento...</p>
        </div>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          {emprendimiento?.plantilla === "1" && <PlantillaUno emprendimiento={emprendimiento} />}
          {emprendimiento?.plantilla === "2" && <PlantillaDos emprendimiento={emprendimiento} />}
          {emprendimiento?.plantilla === "3" && <PlantillaTres emprendimiento={emprendimiento} />}
          {emprendimiento?.plantilla === "4" && <PlantillaCuatro emprendimiento={emprendimiento} />}
        </div>
      )}
    </div>
  );
};
