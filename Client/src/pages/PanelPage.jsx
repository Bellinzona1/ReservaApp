import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/PanelPage.css";
import { useNavigate } from "react-router-dom";
import { CrearTurnoComponent } from "../components/CrearTurnoComponent";
import { DeleteTurno } from "../service/TurnoService"; // Asegúrate de importar el servicio
import Swal from "sweetalert2";
import { EditarTurnoComponent } from "../components/EditarTurnoComponent";
import { AddService, DeleteService } from "../service/Servicios.Service";
import { Previsualizacion } from "../components/Previsualizacion";
import { ClipLoader } from "react-spinners";
import { putEmprendimientoByUserId } from "../service/emprendimientosService";

export const PanelPage = ({ user }) => {
  const [toggleTurnos, setToggleTurnos] = useState(true);
  const [toggleServicios, setToggleServicios] = useState(true);
  const [toggleRedes, setToggleRedes] = useState(true);
  const [turnoEditando, setTurnoEditando] = useState(null); // Nuevo estado para edición
  const [emprendimiento, setEmprendimiento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCrearTurno, setShowCrearTurno] = useState(false);
  const [showPrevisualizar, setShowPrevisualizar] = useState(false);

  const [selectedServices, setSelectedServices] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(""); // Estado para la disponibilidad horaria

  const [socialLinks, setSocialLinks] = useState({
    Instagram: "",
    Facebook: "",
    Telegram: "",
    WhatsApp: ""
  });


  const allServices = [
    'Cantina', 'Baños y Duchas', 'Alquiler para fiestas',
    'Cancha de fútbol', 'Cancha de padel'
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    const redesExistentes = user.emprendimiento?.contenido?.redesSociales || [];
    const links = { Instagram: "", Facebook: "", Telegram: "", WhatsApp: "" };

    redesExistentes.forEach(red => {
      if (links[red.nombre] !== undefined) {
        links[red.nombre] = red.url;  // Pre-cargar la URL si existe
      }
    });

    setSocialLinks(links);

    const fetchEmprendimiento = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/turnos/emprendimiento/${user.emprendimiento._id}`);

        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setEmprendimiento(data);
        const serviciosExistentes = user.emprendimiento.contenido?.servicios || [];
        setSelectedServices(serviciosExistentes);

        // Cargar la disponibilidad horaria actual
        if (data.hora) {
          setSelectedAvailability(data.hora);
        }

      } catch (error) {
        console.error("Error al obtener el emprendimiento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendimiento();
  }, [user]);

  const handleDeleteTurno = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este turno",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await DeleteTurno(id);
          setEmprendimiento((prev) => prev.filter((turno) => turno._id !== id));
          Swal.fire("¡Eliminado!", "El turno ha sido eliminado con éxito.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el turno.", "error");
        }
      }
    });
  };


  const handlePrevisualuzar = () => {
    setShowPrevisualizar(!showPrevisualizar);
  };




  const handleServiceToggle = async (service) => {
    if (selectedServices.includes(service)) {
      try {
        // Llamada al backend para eliminar el servicio
        console.log('Eliminando servicio:', service);
        await DeleteService(user.emprendimiento._id, service);
        Swal.fire('Eliminado!', 'El servicio ha sido eliminado con éxito.', 'success');

        // Actualizar el estado local
        setSelectedServices(selectedServices.filter((s) => s !== service));
      } catch (error) {
        console.log('Error al eliminar el servicio:', error);
        Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
      }
    } else {
      // Añadir servicio localmente
      setSelectedServices([...selectedServices, service]);
      setHasChanges(true);
    }
  };

  const handleSaveServices = async () => {
    try {
      await AddService(user.emprendimiento._id, { servicio: selectedServices });
      Swal.fire('Guardado!', 'Los servicios han sido actualizados con éxito.', 'success');
      setHasChanges(false);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron actualizar los servicios.', 'error');
    }
  };


  const handleAddRed = async (name) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/emprendimientos/red/${user.emprendimiento._id}`, {

        red: {
          nombre: name,
          url: socialLinks[name]
        }
      });

      Swal.fire('Guardado!', `${name} añadido exitosamente.`, 'success');
    } catch (error) {
      console.log('Error al añadir la red social:', error);
      Swal.fire('Error', 'No se pudo añadir la red social.', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  };

  const handleAvailabilityChange = async (e) => {
    const newAvailability = e.target.value;
    setSelectedAvailability(newAvailability);

    try {
      // Llamada al backend para actualizar la disponibilidad horaria
      const response = await putEmprendimientoByUserId(user._id, {
        hora: newAvailability
      });
      console.log("Disponibilidad horaria actualizada:", response);

      Swal.fire("¡Éxito!", "Disponibilidad horaria actualizada correctamente.", "success");
    } catch (error) {
      console.error("Error al actualizar la disponibilidad horaria:", error);
      Swal.fire("Error", "No se pudo actualizar la disponibilidad horaria.", "error");
    }
  };


  if (loading) {
    return <div className="spinner-container"> <ClipLoader size={50} color="#26D8DA" />
      <p>Cargando Emprendimiento...</p></div>;
  }

  return (
    <div className="panel-container">
      <div className="top-bar">
        <a href="/" className="btn-back">← Volver</a>
        <button className="btn-view" onClick={handlePrevisualuzar}>👁️ View</button>
      </div>



      <div className="section">
        <div className="section-header">
          <input type="checkbox" checked={toggleTurnos} onChange={() => setToggleTurnos(!toggleTurnos)} />
          <label> Agendar Turnos</label>
        </div>
        {toggleTurnos && (
          <>
            <div className="turnos-container">
              {emprendimiento?.map((turno) => (
                <div key={turno._id} className="turno-card">
                  <div className="turnoCardOptions">
                    <div className="turnoCardOption turnoCardEdit" onClick={() => setTurnoEditando(turno)}>
                      <img src="https://cdn-icons-png.flaticon.com/512/11372/11372709.png" alt="Editar" />
                    </div>
                    <div className="turnoCardOption turnoCardDelete" onClick={() => handleDeleteTurno(turno._id)}>
                      <img src="https://cdn-icons-png.flaticon.com/512/11284/11284890.png" alt="Eliminar" />
                    </div>
                  </div>
                  {turno.titulo} <br />
                  <p className="textTC">{turno.descripcion?.nombre}</p>
                  {turno.descripcion?.imagen ? (
                    <img src={turno.descripcion.imagen} alt="Turno" />
                  ) : (
                    <button className="btnTurnoCard">+</button>
                  )}
                </div>
              ))}

              {showCrearTurno && <CrearTurnoComponent user={user} onClose={() => setShowCrearTurno(false)} />}
              {turnoEditando && (
                <EditarTurnoComponent
                  turno={turnoEditando}
                  onClose={() => setTurnoEditando(null)}

                />
              )}

              {showPrevisualizar && (<Previsualizacion handlePrevisualuzar={handlePrevisualuzar} user={user} ></Previsualizacion>)}



              <div className="turno-card add-card">
                <button onClick={() => setShowCrearTurno(true)}>+</button>
              </div>
            </div>

            <label>Añade tu disponibilidad horaria:</label>
            <select value={selectedAvailability} onChange={handleAvailabilityChange}>
              <option value="1">1hs</option>
              <option value="2">2hs</option>
              <option value="3">3hs</option>
            </select>
          </>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <input type="checkbox" checked={toggleServicios} onChange={() => setToggleServicios(!toggleServicios)} />
          <label> Servicios</label>
        </div>
        {toggleServicios && (
          <div className="servicios-container">
            {allServices.map((service) => (
              <span
                key={service}
                className={`service-tag ${selectedServices.includes(service) ? 'selected' : ''}`}
                onClick={() => handleServiceToggle(service)}
              >
                {service}
              </span>
            ))}

            {hasChanges && (
              <button className="btn-save" onClick={handleSaveServices}>Guardar Cambios</button>
            )}
          </div>
        )}
      </div>



      <div className="section">
        <div className="section-header">
          <input type="checkbox" checked={toggleRedes} onChange={() => setToggleRedes(!toggleRedes)} />
          <label> Redes Sociales</label>
        </div>
        {toggleRedes && (
          <div className="redes-container">
            {Object.keys(socialLinks).map((key) => (
              <div key={key} className="red-input">
                <input
                  type="text"
                  name={key}
                  value={socialLinks[key]}
                  placeholder={`URL de ${key}`}
                  onChange={handleInputChange}
                />

                <button className="btn-add" onClick={() => handleAddRed(key)}>Añadir</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
