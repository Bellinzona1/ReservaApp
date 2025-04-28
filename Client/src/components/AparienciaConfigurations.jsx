import React, { useState, useEffect } from 'react';
import '../Styles/AparienciaConfigurations.css';
import { Switch, FormControlLabel } from "@mui/material";
import Swal from 'sweetalert2';
import { useRef } from 'react';


export const AparienciaConfigurations = ({ onConfigChange, emprendimiento, setShowReminder, showReminder }) => {

  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);
  const [tempImageFile, setTempImageFile] = useState(null); // ahora guardamos el file, no el url
  const [configData, setConfigData] = useState({
    soloNegocio: false,
    imagen: tempImageFile || "https://donpotrero.com/img/posts/2/medidas_sm.jpg",
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
    if (!showReminder) {
      setShowReminder(true);
    }

    if (key === "dominio") {
      if (/\s/.test(value)) {
        setErrorDominio("No se permiten espacios en el dominio");
        return;
      } else {
        setErrorDominio("");
      }

      value = value.replace(/\s/g, "");

      setConfigData(prevConfig => ({
        ...prevConfig,
        dominio: value,
        subdominio: `tuturno/${value}`,
      }));
    } else {
      setConfigData(prevConfig => ({
        ...prevConfig,
        [key]: value,
      }));
    }
  };


  const handleChooseImage = () => {
    setShowImageModal(true); // abrir el modal
  };

  const handleDeleteImage = () => {
    setConfigData(prevConfig => ({
      ...prevConfig,
      imagen: null,
    }));

    if (!showReminder) {
      setShowReminder(true);
    }
  };


  return (
    <div className='AparienciaConfigurations'>




      {showImageModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Subir nueva imagen</h3>


            {tempImageFile && (
              <div className="image-preview-container">
                <img
                  src={URL.createObjectURL(tempImageFile)}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setTempImageFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // 🔥 Resetea el input file
                    }
                  }}
                >
                  ✕
                </button>

              </div>
            )}


            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTempImageFile(e.target.files[0])}
              className="input-modal"
            />





            <div className="modal-buttons">
              <button
                onClick={async () => {
                  if (tempImageFile) {
                    try {
                      const formData = new FormData();
                      formData.append("file", tempImageFile);
                      formData.append("upload_preset", "ReservAPP Futbol"); // ⚡ tu upload preset unsigned
                      const res = await fetch("https://api.cloudinary.com/v1_1/dzqrcorho/image/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await res.json();
                      console.log("Imagen subida:", data.secure_url);

                      setConfigData(prevConfig => ({
                        ...prevConfig,
                        imagen: data.secure_url || prevConfig.imagen,
                      }));

                      if (!showReminder) {
                        setShowReminder(true);
                      }
                    } catch (err) {
                      console.error("Error subiendo imagen:", err);
                      Swal.fire("Error", "Error al subir la imagen", "error");
                    }
                  }
                  setShowImageModal(false);
                  setTempImageFile(null);
                }}
                className="btn-aceptar"
              >
                Aceptar
              </button>

              <button
                onClick={() => {
                  setShowImageModal(false);
                  setTempImageFile(null);
                }}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}







      <p className='ConfigurationsTitle'>Editar apariencia</p>





      <div className="configurations">
        <div className="imagenSelection">
          <img src={configData.imagen} alt="Imagen seleccionada" />

          <div className="btnConfiguration">
            <button
              className='elegirImagenBtn'
              onClick={handleChooseImage}
            >
              Elegir una imagen
            </button>

            <button
              className='eliminarImagenBtn'
              onClick={handleDeleteImage}
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


      {showReminder && (
        <div className="reminderMessage">
          <p>Cambios no guardados</p>
        </div>
      )}
    </div>









  );
};
