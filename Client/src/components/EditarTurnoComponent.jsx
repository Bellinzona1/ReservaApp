import React, { useState, useEffect, useRef } from "react";
import "../Styles/CrearTurnoComponent.css";
import { EditTurno } from "../service/TurnoService";
import Swal from "sweetalert2";

export const EditarTurnoComponent = ({ turno, onClose }) => {
  const [turnoEditado, setTurnoEditado] = useState(turno);
  const formRef = useRef(null);
  
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current.focus();
      console.log(turno);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["nombre", "imagen", "valor"].includes(name)) {
      setTurnoEditado({
        ...turnoEditado,
        descripcion: { ...turnoEditado.descripcion, [name]: value },
      });
    } else {
      setTurnoEditado({ ...turnoEditado, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const turnoParaEnviar = {
        titulo: turnoEditado.titulo,
        nombre: turnoEditado.descripcion.nombre,
        imagen: turnoEditado.descripcion.imagen,
        valor: turnoEditado.descripcion.valor,
      };

      const response = await EditTurno(turnoEditado._id, turnoParaEnviar);
      Swal.fire("¡Éxito!", "Turno actualizado correctamente", "success");
      onClose(); 
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error al actualizar el turno", "error");
    }
  };


  return (
    <div className="crearContainer" ref={formRef}>
      <div className="crearTurno">
        <span className="cerrarBTN" onClick={onClose}>x</span>
        <h2 className="crearTitulo">Editar Turno</h2>
        <form className="crearForm" onSubmit={handleSubmit}>
          <label className="crearLabel">Título:</label>
          <input
            type="text"
            name="titulo"
            value={turnoEditado.titulo}
            onChange={handleChange}
            required
            className="crearInput"
          />

          <label className="crearLabel">Nombre (Descripción):</label>
          <input
            type="text"
            name="nombre"
            value={turnoEditado.descripcion.nombre}
            onChange={handleChange}
            required
            className="crearInput"
          />

          <label className="crearLabel">Imagen:</label>
          <input
            type="text"
            name="imagen"
            value={turnoEditado.descripcion.imagen}
            onChange={handleChange}
            className="crearInput"
          />

          <label className="crearLabel">Valor:</label>
          <input
            type="number"
            name="valor"
            value={turnoEditado.descripcion.valor}
            onChange={handleChange}
            required
            className="crearInput"
          />

          <button type="submit" className="crearButton">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};
