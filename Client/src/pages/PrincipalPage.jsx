import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEmprendimientoByName } from '../service/emprendimientosService';
import { PlantillaUno } from '../components/plantillas/plantillaUno';
import { ClipLoader } from "react-spinners";
import { PlantillaDos } from '../components/plantillas/PlantillaDos';
import { PlantillaTres } from '../components/plantillas/PlantillaTres';
import { PlantillaCuatro } from '../components/plantillas/PlantillaCuatro';


export const PrincipalPage = () => {
  const { name } = useParams();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Nuevo estado de carga
  const [error, setError] = useState(null); // ✅ Nuevo estado de error

  useEffect(() => {
    if (!name) return; // 🔹 Evita llamadas innecesarias si `name` no está definido

    setLoading(true); // 🔹 Inicia la carga

    getEmprendimientoByName(name)
      .then((data) => {
        setEmprendimiento(data);
        console.log(data)
        setError(null); // 🔹 Limpia errores anteriores
      })
      .catch((error) => {
        console.error("Error en la carga de datos:", error);
        setError("No se pudo cargar el emprendimiento.");
      })
      .finally(() => {
        setLoading(false); // 🔹 Finaliza la carga
      });

  }, [name]); // 🔥 `name` agregado en las dependencias

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

          {emprendimiento.plantilla == "1" && <PlantillaUno emprendimiento={emprendimiento} /> }
          {emprendimiento.plantilla == "2" && <PlantillaDos emprendimiento={emprendimiento}></PlantillaDos>}
          {emprendimiento.plantilla == "3" && <PlantillaTres emprendimiento={emprendimiento}></PlantillaTres>}
          {emprendimiento.plantilla == "4" && <PlantillaCuatro emprendimiento={emprendimiento}></PlantillaCuatro>}




        </div>


      )}
    </div>
  );
};
