import React, { useState, useEffect } from 'react';
import '../Styles/AparienciaConfigurations.css';
import { Switch, FormControlLabel } from "@mui/material";
import Swal from 'sweetalert2';

export const AparienciaConfigurations = ({ onConfigChange, emprendimiento }) => {
  const [configData, setConfigData] = useState({
    soloNegocio: false,
    imagen: "https://donpotrero.com/img/posts/2/medidas_sm.jpg",
    dominio: "",
    subdominio: "tuturno/",
    nombreEmprendimiento: "",
    descripcion: "", 
  });

  const [errorDominio, setErrorDominio] = useState(""); // 🚀 Estado para el mensaje de error

  // 🔹 Sincronizar `configData` con `emprendimiento` cuando cambie
  useEffect(() => {
    if (emprendimiento) {
      setConfigData({
        soloNegocio: false,
        imagen: emprendimiento.imagen || "https://donpotrero.com/img/posts/2/medidas_sm.jpg",
        dominio: emprendimiento.dominio || "",
        subdominio: `tuturno/${emprendimiento.dominio || ""}`,
        nombreEmprendimiento: emprendimiento.nombre || "",
        descripcion: emprendimiento.descripcion || "", 
      });
    }
  }, [emprendimiento]);

  // 🔹 Notificar cambios al componente padre solo cuando `configData` cambie
  useEffect(() => {
    onConfigChange(configData);
  }, [configData]);

  // 🔹 Función para actualizar `configData`
  const handleChange = (key, value) => {
    if (key === "dominio") {
      // 🔥 Evitar espacios en el dominio
      if (/\s/.test(value)) {
        setErrorDominio("No se permiten espacios en el dominio");
        return;
      } else {
        setErrorDominio(""); // Limpiar mensaje de error si es válido
      }

      // 🔥 Eliminar espacios automáticamente
      value = value.replace(/\s/g, "");

      setConfigData(prevConfig => ({
        ...prevConfig,
        dominio: value,
        subdominio: `tuturno/${value}`, // 🔥 Actualizar subdominio automáticamente
      }));
    } else {
      setConfigData(prevConfig => ({
        ...prevConfig,
        [key]: value,
      }));
    }
  };

  const handleTemporal = () => {
  
    Swal.fire({
      icon: 'info',
      title: 'Este funcionalidad no está disponible',

    })
  }

  return (
    <div className='AparienciaConfigurations'>
      <p className='ConfigurationsTitle'>Editar apariencia</p>

      <div className="soloNegocioButton">
        <FormControlLabel
          control={
            <Switch
              checked={configData.soloNegocio}
              onChange={(e) => handleChange("soloNegocio", e.target.checked)}
              color="primary"
            />
          }
          label="Solo negocio"
        />
      </div>

      <div className="configurations">
        <div className="imagenSelection">
          <img src={configData.imagen} alt="Imagen seleccionada" />

          <div className="btnConfiguration">
            <button 
              className='elegirImagenBtn'
              onClick={() => handleTemporal()} 
            >
              Elegir una imagen
            </button>
            <button 
              className='eliminarImagenBtn'
              onClick={() => handleTemporal()}
            >
              Eliminar imagen
            </button>
          </div>
        </div>

        <div className="namesConfigurations">
          <label>Dominio</label>
          <input 
            type="text" 
            placeholder="zonasport" 
            value={configData.dominio}
            onChange={(e) => handleChange("dominio", e.target.value)}
          />
          {errorDominio && <p className="error-message">{errorDominio}</p>} {/* 🔥 Mostrar mensaje de error */}

          <label>Subdominio</label>
          <input 
            type="text" 
            placeholder="tuturno/zonasport"
            value={configData.subdominio}
            readOnly // 🔥 Hace que el usuario no pueda editarlo manualmente
          />

          <label>Nombre del emprendimiento</label>
          <input 
            type="text" 
            placeholder="Zona Sport"
            value={configData.nombreEmprendimiento}
            onChange={(e) => handleChange("nombreEmprendimiento", e.target.value)}
          />

          <label>Descripción</label>
          <input 
            type="text" 
            placeholder="Abierto de lunes a sábados | 10 am–22pm"
            value={configData.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
