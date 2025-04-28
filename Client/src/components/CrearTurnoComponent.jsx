import React, { useState, useEffect, useRef } from 'react';
import '../Styles/CrearTurnoComponent.css';
import { CreateTurno } from '../service/TurnoService';
import Swal from "sweetalert2";

export const CrearTurnoComponent = ({ user, onClose }) => {
  const [turno, setTurno] = useState({
    titulo: '',
    nombre: '',
    imagen: '',
    valor: ''
  });

  const [tempImageFile, setTempImageFile] = useState(null); // Para preview
  const fileInputRef = useRef(null); // Para resetear input file
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setTurno({ ...turno, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Turno a crear:", turno);
      console.log("Emprendimiento del usuario:", user.emprendimiento);

      const response = await CreateTurno(user.emprendimiento._id, turno);

      Swal.fire("¡Éxito!", "Turno creado correctamente", "success");

      window.location.reload();

      onClose();
    } catch (error) {
      console.error("Error al crear el turno:", error);
      Swal.fire("Error", error.response?.data?.message || "Error al crear el turno", "error");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTempImageFile(file); // Mostrar preview antes de subir

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ReservAPP Futbol");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dzqrcorho/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Imagen subida:", data.secure_url);
      setTurno({ ...turno, imagen: data.secure_url });
    } catch (err) {
      console.error("Error al subir imagen:", err);
      Swal.fire("Error", "No se pudo subir la imagen", "error");
    }
  };

  const handleRemoveImage = () => {
    setTempImageFile(null);
    setTurno({ ...turno, imagen: '' });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="crearContainer" ref={formRef}>
      <div className="crearTurno">
        <span className='cerrarBTN' onClick={onClose}>x</span>
        <h2 className="crearTitulo">Crear Nuevo Turno</h2>

        <form className="crearForm" onSubmit={handleSubmit}>
          <label className="crearLabel">Título:</label>
          <input
            type="text"
            name="titulo"
            value={turno.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: Cancha de fútbol"
            className="crearInput"
          />

          <label className="crearLabel">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={turno.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Cancha de 6vs6 jugadores"
            className="crearInput"
          />

          <label className="crearLabel">Imagen:</label>

          {/* PREVIEW de la imagen */}
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
                onClick={handleRemoveImage}
              >
                ✕
              </button>
            </div>
          )}

          {/* INPUT de archivo */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="crearInput"
            ref={fileInputRef}
          />

          <label className="crearLabel">Precio:</label>
          <input
            type="number"
            name="valor"
            value={turno.valor}
            onChange={handleChange}
            required
            placeholder="Ej: 500"
            className="crearInput"
          />

          <button type="submit" className="crearButton">Crear Turno</button>
        </form>
      </div>
    </div>
  );
};
