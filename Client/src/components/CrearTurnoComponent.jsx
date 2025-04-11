import React, { useState, useEffect, useRef } from 'react';
import '../Styles/CrearTurnoComponent.css';
import { CreateTurno } from '../service/TurnoService';
import Swal from "sweetalert2";

export const CrearTurnoComponent = ({ user, onClose }) => {
  const [turno, setTurno] = useState({
    titulo: '',
    nombre: '',
    imagen: '',
    valor: '' // Nuevo campo para el precio del turno
  });

  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current.focus(); // También enfoca el input
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
      
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al crear el turno:", error);
      Swal.fire("Error", error.response?.data?.message || "Error al crear el turno", "error");
    }
  };

  return (
    <div className="crearContainer" ref={formRef}>
      <div className="crearTurno">
        <span className='cerrarBTN' onClick={onClose}>x</span>
        <h2 className="crearTitulo">Crear Nuevo Turno</h2>
        <form className="crearForm" onSubmit={handleSubmit} >
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
          <input
            type='text'
            name="imagen"
            value={turno.imagen}
            onChange={handleChange}
            placeholder="https://mi-imagen.com/corte.jpg"
            className="crearInput"
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